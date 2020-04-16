var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_mvpMatrix;\n'+//模型视图投影矩阵
'uniform mat4 u_normalMatrix;\n'+//法向量变化矩阵（原有法向量乘以模型矩阵的逆转置矩阵）
'attribute vec4 a_Normal;\n'+//法向量
'uniform vec3 u_LightColor;\n'+//光线颜色
'uniform vec3 u_LightDirection;\n'+//归一化后的光线方向
'uniform vec3 u_AmbientLight;\n'+//环境反射光
'varying vec4 v_Color;\n'+
'void main() {\n'+
 ' gl_Position = u_mvpMatrix* a_Position;\n'+
 ' vec4 color = vec4(1.0, 0.4, 0.0, 1.0);\n'+
 ' vec3 normal = normalize(vec3(u_normalMatrix*a_Normal));\n'+//归一化法向量
 ' float nDotL = max(dot(u_LightDirection,normal),0.0);\n'+ //光线方向向量与法向量的点积即cos入射角
 ' vec3 diffuse = u_LightColor * color.rgb * nDotL;\n'+
 ' vec3 ambient = u_AmbientLight * vec3(color);\n'+
 ' v_Color = vec4(diffuse+ambient,color.a);\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'varying vec4 v_Color;\n'+
 'void main() {\n'+
 '  gl_FragColor=v_Color;\n'+
 '}\n';
 var last =Date.now();
 var ANGLE_STEP=3.0;//每次按键转动的角度
 var g_arm1Angle =-90.0;//arm1当前角度
 var g_arm2Angle =0.0; //arm2角度
 function init(){
     var canvas =document.getElementById("canvas");
     var gl =createGLContext(canvas);
     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败.');
        return;
    }
    var u_mvpMatrix =gl.getUniformLocation(gl.program,'u_mvpMatrix');
    var u_normalMatrix =gl.getUniformLocation(gl.program,'u_normalMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor');
    var u_LightDirection =gl.getUniformLocation(gl.program,'u_LightDirection');
    var u_AmbientLight =gl.getUniformLocation(gl.program,'u_AmbientLight');
    if (!u_mvpMatrix || !u_normalMatrix||!u_LightColor||!u_LightDirection||!u_AmbientLight) {
        console.log('Failed to get the storage location');
        return;
    }
    gl.uniform3f(u_LightColor,0.5,0.5,0.5);
    gl.uniform3f(u_LightDirection,0.0, 0.5, 0.7);
    gl.uniform3f(u_AmbientLight,0.5,0.5,0.5);
    var viewProjMatrix =new Matrix4();
    viewProjMatrix.setPerspective(50,canvas.width/canvas.height,1,100);
    viewProjMatrix.lookAt(20.0, 10.0, 30.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
    var n =initVertexBuffer(gl);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);

    document.onkeydown=function(evt){
        keydownHandler(evt,gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix);
    }
    draw(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix);
 }

 function keydownHandler(evt,gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix){
     console.log(evt);
     if(evt.keyCode===39){//右
        g_arm1Angle =(g_arm1Angle+ANGLE_STEP)%360;
     }
     if(evt.keyCode===37){//左
        g_arm1Angle =(g_arm1Angle-ANGLE_STEP)%360;
     }
     if(evt.keyCode===38){//上
        if(g_arm2Angle<135){
            g_arm2Angle +=ANGLE_STEP;
        }
     }
     if(evt.keyCode===40){//下
        if(g_arm2Angle>-135){
            g_arm2Angle -=ANGLE_STEP;
        }
     }
     
     draw(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix)
 }
 

 function initVertexBuffer(gl){  
    var vertices = new Float32Array([
        1.5, 10.0, 1.5, -1.5, 10.0, 1.5, -1.5,  0.0, 1.5,  1.5,  0.0, 1.5, // v0-v1-v2-v3 front
        1.5, 10.0, 1.5,  1.5,  0.0, 1.5,  1.5,  0.0,-1.5,  1.5, 10.0,-1.5, // v0-v3-v4-v5 right
        1.5, 10.0, 1.5,  1.5, 10.0,-1.5, -1.5, 10.0,-1.5, -1.5, 10.0, 1.5, // v0-v5-v6-v1 up
       -1.5, 10.0, 1.5, -1.5, 10.0,-1.5, -1.5,  0.0,-1.5, -1.5,  0.0, 1.5, // v1-v6-v7-v2 left
       -1.5,  0.0,-1.5,  1.5,  0.0,-1.5,  1.5,  0.0, 1.5, -1.5,  0.0, 1.5, // v7-v4-v3-v2 down
        1.5,  0.0,-1.5, -1.5,  0.0,-1.5, -1.5, 10.0,-1.5,  1.5, 10.0,-1.5  // v4-v7-v6-v5 back
      ]);
    
      // Normal
      var normals = new Float32Array([
        0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0, // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0, // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0, // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0,  0.0,-1.0, 0.0, // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0,  0.0, 0.0,-1.0  // v4-v7-v6-v5 back
      ]);
    
      // Indices of the vertices
      var indices = new Uint8Array([
         0, 1, 2,   0, 2, 3,    // front
         4, 5, 6,   4, 6, 7,    // right
         8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
      ]);
    if(!initArrayBuffer(gl,'a_Position',vertices,3,gl.FLOAT,false,0,0)){
        console.log('顶点位置缓冲区创建失败');
    }
    
    if(!initArrayBuffer(gl,'a_Normal',normals,3,gl.FLOAT,false,0,0)){
        console.log('顶点法向量缓冲区创建失败');
    }
     //顶点索引缓冲区
    var indexBuffer =gl.createBuffer();
    if(!indexBuffer){
        console.log('创建索引缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;
 }

 function initArrayBuffer(gl,index,arrayData,size,type,normalized,stride,offset){
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,arrayData,gl.STATIC_DRAW);
    var a_type =gl.getAttribLocation(gl.program,index);
    gl.vertexAttribPointer(a_type,size,type,normalized,stride,offset);
    gl.enableVertexAttribArray(a_type);
    gl.bindBuffer(gl.ARRAY_BUFFER,null);
    return true;
 }
 function animateAngle(angle){
    var now =Date.now();
    var dtime = now-last;
    last=now;
    var newAngle =angle+(ANGLE_STEP*dtime)/1000;
    return newAngle %=360;
 }
var g_modelMatrix =new Matrix4();
var g_mvpMatrix =new Matrix4();
var g_normalMatrix =new Matrix4();

function draw(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix){

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);

    var arm1Length = 10.0;//arm1长度
    g_modelMatrix.setTranslate(0.0,-12.0,0.0);
    g_modelMatrix.rotate(g_arm1Angle,0.0,1.0,0.0);
    drawCube(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix);
    //arm2
    g_modelMatrix.translate(0.0,arm1Length,0.0);
    g_modelMatrix.rotate(g_arm2Angle,0.0,0.0,1.0);
    g_modelMatrix.scale(1.3,1.0,1.3);
    drawCube(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix);
}
 function drawCube(gl,n,viewProjMatrix,u_mvpMatrix,u_normalMatrix){
    
    g_mvpMatrix.set(viewProjMatrix);
    g_mvpMatrix.multiply(g_modelMatrix);

    //法线矩阵
    g_normalMatrix.setInverseOf(g_modelMatrix);
    g_normalMatrix.transpose();
    gl.uniformMatrix4fv(u_normalMatrix,false,g_normalMatrix.elements);
    gl.uniformMatrix4fv(u_mvpMatrix,false,g_mvpMatrix.elements);
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_BYTE, 0);
 }
 init();