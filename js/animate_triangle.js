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
 var last =Date.now();
 var ANGLE_STEP=45;//每秒旋转角度
 function init(){
     var canvas =document.getElementById("canvas");
     var gl =createGLContext(canvas);
     if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败.');
        return;
    }
    var u_xformMatrix =gl.getUniformLocation(gl.program,'u_xformMatrix');
    var xformMatrix =new Matrix4();
    var currentAngle=0.0;//当前角度
    var n =initMultiPointsBuffer(gl);
    gl.clearColor(0.0, 0.0, 0.0, 0.5);//设置背景颜色
    var tick =function(){
        currentAngle=animateAngle(currentAngle);

        drawTriangle(gl,currentAngle,u_xformMatrix,xformMatrix,n);
        requestAnimationFrame(tick);
    }

    tick();

    
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

   

    return n;
 }

 function animateAngle(angle){
    var now =Date.now();
    var dtime = now-last;
    last=now;
    var newAngle =(ANGLE_STEP*dtime)/1000;
    return newAngle %=360;
 }

 function drawTriangle(gl,angle,u_xformMatrix,xformMatrix,n){
    xformMatrix.rotate(angle,0,0,1);
    
    gl.uniformMatrix4fv(u_xformMatrix,false,xformMatrix.elements);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES,0,n);
 }
init();