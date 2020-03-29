var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'void main() {\n'+
 ' gl_Position=a_Position;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'uniform float u_Height;\n' +
 'uniform float u_Width;\n' +
 'void main() {\n'+
 '  gl_FragColor=vec4(gl_FragCoord.x/u_Width,0.5,gl_FragCoord.y/u_Height,1.0);\n'+
 '}\n';

 function init(){
    var canvas =document.getElementById("canvas");
    var gl =createGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
       console.log('初始化着色器失败.');
       return;
   }
   
   var n =initMultiPointsBuffer(gl);
   gl.clearColor(0.0, 0.0, 0.0, 0.5);

   gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES,0,n);

 }

 function initMultiPointsBuffer(gl){
    var n =3;
    var vertices =new Float32Array([
        0.0,0.5,
        -0.5,-0.5,
        0.5,-0.5
    ])
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_Position);
    var u_Height =gl.getUniformLocation(gl.program,'u_Height');
    var u_Width =gl.getUniformLocation(gl.program,'u_Width');
    console.log(gl.drawingBufferHeight+"="+gl.drawingBufferWidth)
    gl.uniform1f(u_Height,gl.drawingBufferHeight);
    gl.uniform1f(u_Width,gl.drawingBufferWidth);
    return n;
 }

 init();