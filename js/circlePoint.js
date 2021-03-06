var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec4 a_Color;'+
'varying vec4 v_Color;\n' +
'void main() {\n'+
 ' gl_Position=a_Position;\n'+
 ' gl_PointSize=20.0;\n'+
 ' v_Color=a_Color;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'varying vec4 v_Color;\n' +
 'void main() {\n'+
 ' float dist =distance(gl_PointCoord,vec2(0.5,0.5));\n'+
 ' if(dist<0.5) {\n'+
 '  gl_FragColor=v_Color;\n'+
 '} else{ discard;}\n'+
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
    gl.drawArrays(gl.POINTS,0,3);
 }

 function initMultiPointsBuffer(gl){
    var n =3;
    var vertices =new Float32Array([
        0.0,0.5,1.0,0.0,0.0,1.0,
        -0.5,-0.5,0.0,1.0,0.0,1.0,
        0.5,-0.5,1.0,1.0,1.0,1.0
    ])
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var a_Color =gl.getAttribLocation(gl.program,'a_Color');
    console.log(vertices.BYTES_PER_ELEMENT);
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,6*vertices.BYTES_PER_ELEMENT,0);

    gl.enableVertexAttribArray(a_Position);

    
    gl.vertexAttribPointer(a_Color,4,gl.FLOAT,false,6*vertices.BYTES_PER_ELEMENT,2*vertices.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(a_Color);

    return n;
 }
 init();