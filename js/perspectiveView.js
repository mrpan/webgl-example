var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_ViewMatrix;\n'+//视图矩阵
'uniform mat4 u_ModelMatrix;\n'+//模型矩阵
'uniform mat4 u_ProjMatrix;\n'+//投影矩阵
'attribute vec4 a_Color;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
 ' gl_Position=u_ProjMatrix*u_ViewMatrix *u_ModelMatrix* a_Position;\n'+
 ' v_Color=a_Color;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'varying vec4 v_Color;\n'+
 'void main() {\n'+
 '  gl_FragColor=v_Color;\n'+
 '}\n';

 function init(){
     var canvas =document.getElementById("canvas");
     var gl =createGLContext(canvas);
     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败.');
        return;
    }
    //视图矩阵
    var uViewMatrix =new Matrix4();
   
    var u_ViewMatrix =gl.getUniformLocation(gl.program,'u_ViewMatrix');

    
    document.onkeydown=function(evt){
        keydownHandler(evt,gl,u_ViewMatrix,uViewMatrix);
    }
    // gl.drawArrays(gl.LINES,0,3);
    // gl.drawArrays(gl.LINE_STRIP,0,3);
    // gl.drawArrays(gl.LINE_LOOP,0,3);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
    //投影矩阵-透视投影

    var uProjMatrix =new Matrix4();
    uProjMatrix.setPerspective(30,canvas.width/canvas.height,1,100)//透视投影参数（垂直视角、近裁面宽高比、近裁面位置、远裁面位置）
    var u_ProjMatrix =gl.getUniformLocation(gl.program,'u_ProjMatrix');
    gl.uniformMatrix4fv(u_ProjMatrix,false,uProjMatrix.elements);
    drawTriagnles(gl,u_ViewMatrix,uViewMatrix);


    
 }
 var eyeX=0,eyeY=0,eyeZ=5;//视点
 function keydownHandler(evt,gl,u_ViewMatrix,uViewMatrix){
     console.log(evt);
     if(evt.keyCode===39){
         eyeX+=0.01;
     }
     if(evt.keyCode===37){
         eyeX -=0.01;
     }
     if(evt.keyCode===38){
         eyeY+=0.01;
     }
     if(evt.keyCode===40){
         eyeY -=0.01;
     }
    drawTriagnles(gl,u_ViewMatrix,uViewMatrix);

 }
 function drawTriagnles(gl,u_ViewMatrix,uViewMatrix,){
    uViewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, -100, 0, 1, 0);
    gl.uniformMatrix4fv(u_ViewMatrix,false,uViewMatrix.elements);
    var n =initMultiPointsBuffer(gl);

    //模型矩阵
    var uModelMatrix =new Matrix4();
    uModelMatrix.setRotate(0,0,0,-1);
    var u_ModelMatrix = gl.getUniformLocation(gl.program,'u_ModelMatrix');
    gl.uniformMatrix4fv(u_ModelMatrix,false,uModelMatrix.elements);
   
    
    gl.clearColor(0.0, 0.0, 0.0, 0.5);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,n);
 }

 function initMultiPointsBuffer(gl){
    var n =18;
  
    var vertices = new Float32Array([
        // Three triangles on the right side
        0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
        0.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
        1.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
    
        0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
        0.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
        1.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
    
        0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
        0.25, -1.0,   0.0,  0.4,  0.4,  1.0,
        1.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
    
        // Three triangles on the left side
       -0.75,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
       -1.25, -1.0,  -4.0,  0.4,  1.0,  0.4,
       -0.25, -1.0,  -4.0,  1.0,  0.4,  0.4, 
    
       -0.75,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
       -1.25, -1.0,  -2.0,  1.0,  1.0,  0.4,
       -0.25, -1.0,  -2.0,  1.0,  0.4,  0.4, 
    
       -0.75,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
       -1.25, -1.0,   0.0,  0.4,  0.4,  1.0,
       -0.25, -1.0,   0.0,  1.0,  0.4,  0.4, 
      ]);
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

   
    var FSIZE =vertices.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');

    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,6*FSIZE,0);

    gl.enableVertexAttribArray(a_Position);
    //颜色
    var a_Color =gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,6*FSIZE,3*FSIZE);

    gl.enableVertexAttribArray(a_Color);
    

    return n;
 }
 init();