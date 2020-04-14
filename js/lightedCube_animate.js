var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_mvpMatrix;\n'+//模型视图投影矩阵
'uniform mat4 u_normalMatrix;\n'+//法向量变化矩阵（原有法向量乘以模型矩阵的逆转置矩阵）
'attribute vec4 a_Color;\n'+//表面颜色
'attribute vec4 a_Normal;\n'+//法向量
'uniform vec3 u_LightColor;\n'+//光线颜色
'uniform vec3 u_LightDirection;\n'+//归一化后的光线方向
'uniform vec3 u_AmbientLight;\n'+//环境反射光
'varying vec4 v_Color;\n'+
'void main() {\n'+
 ' gl_Position = u_mvpMatrix* a_Position;\n'+
 ' vec3 normal = normalize(vec3(u_normalMatrix*a_Normal));\n'+//归一化法向量
 ' float nDotL = max(dot(u_LightDirection,normal),0.0);\n'+ //光线方向向量与法向量的点积即cos入射角
 ' vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n'+
 ' vec3 ambient = u_AmbientLight * vec3(a_Color);\n'+
 ' v_Color = vec4(diffuse+ambient,a_Color.a);\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'varying vec4 v_Color;\n'+
 'void main() {\n'+
 '  gl_FragColor=v_Color;\n'+
 '}\n';
 var last =Date.now();
 var ANGLE_STEP=45;//每秒旋转角度
 function init(){
     var canvas =document.getElementById("canvas");
     var gl =createGLContext(canvas);
     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败.');
        return;
    }
    
    // document.onkeydown=function(evt){
    //     keydownHandler(evt,gl,canvas);
    // }
    // gl.drawArrays(gl.LINES,0,3);
    // gl.drawArrays(gl.LINE_STRIP,0,3);
    // gl.drawArrays(gl.LINE_LOOP,0,3);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
    var currentAngle=0.0;//当前角度
    var tick =function(){
        currentAngle=animateAngle(currentAngle);

        drawTriagnles(gl,canvas,currentAngle);
        requestAnimationFrame(tick);
    }

    tick();

   


    
 }
 var eyeX=3,eyeY=3,eyeZ=7;//视点
 var step =0.1
 function keydownHandler(evt,gl,canvas){
     console.log(evt);
     if(evt.keyCode===39){
         eyeX+=step;
     }
     if(evt.keyCode===37){
         eyeX -=step;
     }
     if(evt.keyCode===38){
         eyeY+=step;
     }
     if(evt.keyCode===40){
         eyeY -=step;
     }
    drawTriagnles(gl,canvas);

 }
 function drawTriagnles(gl,canvas,angle){
    var n =initColoredBuffer(gl);
    var mvpMatrix =new Matrix4();//模型视图投影矩阵
    var modelMatrix =new Matrix4();//模型矩阵
    var normalMatrix= new Matrix4();//法向量变化矩阵
     mvpMatrix.setPerspective(50,canvas.width/canvas.height,1,100);
     mvpMatrix.lookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);
     modelMatrix.setTranslate(0,1,0);
     modelMatrix.setRotate(angle,0,1,0);
     mvpMatrix.multiply(modelMatrix);
     normalMatrix.setInverseOf(modelMatrix);//模型矩阵的逆矩阵
     normalMatrix.transpose();//进行转置
    var u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');

    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);

    var u_normalMatrix =gl.getUniformLocation(gl.program,'u_normalMatrix');
    gl.uniformMatrix4fv(u_normalMatrix,false,normalMatrix.elements);
    var u_LightColor = gl.getUniformLocation(gl.program,'u_LightColor');
    var u_LightDirection = gl.getUniformLocation(gl.program,'u_LightDirection');
    var u_AmbientLight =gl.getUniformLocation(gl.program,'u_AmbientLight');
    //设置光线颜色
    gl.uniform3f(u_LightColor,1.0,0.0,0.0);
    //设置光线方向
    var lightDrirection = new Vector3([0.5,3.0,4.0]);
    lightDrirection.normalize();//利用cuon-matrix进行归一化
    gl.uniform3fv(u_LightDirection,lightDrirection.elements);
    gl.uniform3f(u_AmbientLight,0.2,0.2,0.2);
    gl.clearColor(0.0, 0.0, 0.0, 0.5);
    //隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);
    // //深度冲突 采用多边形偏移机制解决
    // gl.enable(gl.POLYGON_OFFSET_FILL);
    // gl.polygonOffset(1.0,0.1);
    

    // gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

 }

 function initColoredBuffer(gl){  
     //顶点、颜色分开使用缓冲区，正方体单面着色
    var vertices = new Float32Array([   // Vertex coordinates
        1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
        1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
       -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
       -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
        1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
     ]);
    //每个面一种颜色
    //  var colors = new Float32Array([     // Colors
    //    0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
    //    0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
    //    1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
    //    1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
    //    1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
    //    0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
    //  ]);
     //6个面为白色
     var colors = new Float32Array([     // Colors
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v1-v2-v3 front(white)
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v3-v4-v5 right(white)
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v0-v5-v6-v1 up(white)
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v1-v6-v7-v2 left(white)
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down(white)
        1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0   // v4-v7-v6-v5 back(white)
      ]);
    //   var colors = new Float32Array([    // Colors
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v1-v2-v3 front
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v3-v4-v5 right
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v0-v5-v6-v1 up
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v1-v6-v7-v2 left
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0,     // v7-v4-v3-v2 down
    //     1, 0, 0,   1, 0, 0,   1, 0, 0,  1, 0, 0　    // v4-v7-v6-v5 back
    //  ]);
     var indices = new Uint8Array([       // Indices of the vertices
        0, 1, 2,   0, 2, 3,    // front
        4, 5, 6,   4, 6, 7,    // right
        8, 9,10,   8,10,11,    // up
       12,13,14,  12,14,15,    // left
       16,17,18,  16,18,19,    // down
       20,21,22,  20,22,23     // back
     ]);
     //顶点法向量
     var normals = new Float32Array([    // Normal
        0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,  // v0-v1-v2-v3 front
        1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,  // v0-v3-v4-v5 right
        0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,  // v0-v5-v6-v1 up
       -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  // v1-v6-v7-v2 left
        0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,   0.0,-1.0, 0.0,  // v7-v4-v3-v2 down
        0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0,   0.0, 0.0,-1.0   // v4-v7-v6-v5 back
      ]);
    if(!initArrayBuffer(gl,'a_Position',vertices,3,gl.FLOAT,false,0,0)){
        console.log('顶点位置缓冲区创建失败');
    }
    if(!initArrayBuffer(gl,'a_Color',colors,3,gl.FLOAT,false,0,0)){
        console.log('顶点颜色缓冲区创建失败');
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
 init();