var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_mvpMatrix;\n'+//模型视图投影矩阵
'attribute vec4 a_Color;\n'+
'varying vec4 v_Color;\n'+
'void main() {\n'+
 ' gl_Position=u_mvpMatrix* a_Position;\n'+
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
    //投影矩阵-透视投影

    var uProjMatrix =new Matrix4();
    uProjMatrix.setPerspective(30,canvas.width/canvas.height,1,100)//透视投影参数（垂直视角、近裁面宽高比、近裁面位置、远裁面位置）
    document.onkeydown=function(evt){
        keydownHandler(evt,gl,uViewMatrix,uProjMatrix);
    }
    // gl.drawArrays(gl.LINES,0,3);
    // gl.drawArrays(gl.LINE_STRIP,0,3);
    // gl.drawArrays(gl.LINE_LOOP,0,3);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
    drawTriagnles(gl,uViewMatrix,uProjMatrix);


    
 }
 var eyeX=0,eyeY=0,eyeZ=5;//视点
 function keydownHandler(evt,gl,uViewMatrix,uProjMatrix){
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
    drawTriagnles(gl,uViewMatrix,uProjMatrix);

 }
 function drawTriagnles(gl,uViewMatrix,uProjMatrix){
    uViewMatrix.setLookAt(eyeX, eyeY, eyeZ, 0, 0, -100, 0, 1, 0);
    var n =initMultiPointsBuffer(gl);

    //模型矩阵-平移
    var uModelMatrix =new Matrix4();
    uModelMatrix.setTranslate(0.75,0,0);
    var mvpMatrix =new Matrix4();
    mvpMatrix.set(uProjMatrix).multiply(uViewMatrix).multiply(uModelMatrix);
    var u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');
    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
    //隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    //深度冲突 采用多边形偏移机制解决
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0,0.1);
    gl.clearColor(0.0, 0.0, 0.0, 0.5);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,n);

    uModelMatrix.setTranslate(-0.75,0,0);
    mvpMatrix.set(uProjMatrix).multiply(uViewMatrix).multiply(uModelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);
    gl.drawArrays(gl.TRIANGLES,0,n);

 }

 function initMultiPointsBuffer(gl){
    var n =9;
  
    var vertices = new Float32Array([
     0.0,  1.0,  -2.0,  1.0,  1.0,  0.4, // The middle yellow one
    -0.5, -1.0,  -2.0,  1.0,  1.0,  0.4,
     0.5, -1.0,  -2.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,   0.0,  0.4,  0.4,  1.0,  // The front blue one 
    -0.5, -1.0,   0.0,  0.4,  0.4,  1.0,
     0.5, -1.0,   0.0,  1.0,  0.4,  0.4, 

     0.0,  1.0,  -4.0,  0.4,  1.0,  0.4, // The back green one
    -0.5, -1.0,  -4.0,  0.4,  1.0,  0.4,
     0.5, -1.0,  -4.0,  1.0,  0.4,  0.4, 
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