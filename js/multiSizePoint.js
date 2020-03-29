var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute float a_PointSize;\n'+
'void main() {\n'+
 ' gl_Position=a_Position;\n'+
 ' gl_PointSize=a_PointSize;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'void main() {\n'+
 '  gl_FragColor=vec4(1.0,0.0,0.0,1.0);\n'+
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
    gl.drawArrays(gl.POINTS,0,n);
 }

 function initMultiPointsBuffer(gl){
    var n =3;
    var vertices =new Float32Array([
        0.0,0.5,10.0,
        -0.5,-0.5,15.0,
        0.5,-0.5,20.0
    ])
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var a_PointSize =gl.getAttribLocation(gl.program,'a_PointSize');
    console.log(vertices.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,3*vertices.BYTES_PER_ELEMENT,0);

    gl.enableVertexAttribArray(a_Position);

    
    gl.vertexAttribPointer(a_PointSize,1,gl.FLOAT,false,3*vertices.BYTES_PER_ELEMENT,2*vertices.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_PointSize);

    return n;
 }
 init();