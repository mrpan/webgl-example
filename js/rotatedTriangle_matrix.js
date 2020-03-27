var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'uniform mat4 u_xformMatrix;\n'+
'void main() {\n'+
 ' gl_Position=u_xformMatrix * a_Position;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'void main() {\n'+
 '  gl_FragColor=vec4(1.0,1.0,0.0,1.0);\n'+
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
    // gl.drawArrays(gl.LINES,0,3);
    // gl.drawArrays(gl.LINE_STRIP,0,3);
    // gl.drawArrays(gl.LINE_LOOP,0,3);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);


    
 }

 function initMultiPointsBuffer(gl){
    var n =3;
    var angle=0;
    var radian =Math.PI*angle/180;
    var cosB =Math.cos(radian);
    var sinB =Math.sin(radian);
    var vertices =new Float32Array([
        0.0,0.5,
        -0.5,-0.5,
        0.5,-0.5
    ])
    // //旋转矩阵
    // var xformMatrix=new Float32Array([
    //     cosB, sinB, 0.0, 0.0,
    //     -sinB, cosB, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     0.0, 0.0, 0.0, 1.0
    // ]);
    //平移矩阵
    // var tx=0.5,ty=0.5,tz=0;
    // var xformMatrix = new Float32Array([
    //     1.0, 0.0, 0.0, 0.0,
    //     0.0, 1.0, 0.0, 0.0,
    //     0.0, 0.0, 1.0, 0.0,
    //     tx, ty, tz, 1.0
    // ]);
    //缩放矩阵
    var sx=1.0,sy=1.5,sz=1.0;
    var xformMatrix = new Float32Array([
        sx, 0.0, 0.0, 0.0,
        0.0, sy, 0.0, 0.0,
        0.0, 0.0, sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    // var n =4;
    // var vertices =new Float32Array([
    //     -0.5,0.5,1.0,0.0,0.0,1.0,
    //     -0.5,-0.5,0.0,1.0,0.0,1.0,
    //     0.5,0.5,1.0,1.0,1.0,1.0,
    //     0.5,-0.5,1.0,1.0,1.0,1.0,
    // ])
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

    var u_xformMatrix =gl.getUniformLocation(gl.program,'u_xformMatrix');
    
    gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix);

    return n;
 }
 init();