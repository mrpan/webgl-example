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
    
    document.onkeydown=function(evt){
        keydownHandler(evt,gl,canvas);
    }
    // gl.drawArrays(gl.LINES,0,3);
    // gl.drawArrays(gl.LINE_STRIP,0,3);
    // gl.drawArrays(gl.LINE_LOOP,0,3);
    // gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
    // gl.drawArrays(gl.TRIANGLE_FAN,0,n);
    drawTriagnles(gl,canvas);


    
 }
 var eyeX=3,eyeY=3,eyeZ=8;//视点
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
 function drawTriagnles(gl,canvas){
    var n =initMultiPointsBuffer(gl);
    var mvpMatrix =new Matrix4();//模型视图投影矩阵
     mvpMatrix.setPerspective(50,canvas.width/canvas.height,1,100);
     mvpMatrix.lookAt(eyeX, eyeY, eyeZ, 0, 0, 0, 0, 1, 0);
     mvpMatrix.translate(0,0,0);
    var u_mvpMatrix = gl.getUniformLocation(gl.program,'u_mvpMatrix');

    gl.uniformMatrix4fv(u_mvpMatrix,false,mvpMatrix.elements);

    gl.clearColor(0.0, 0.0, 0.0, 0.5);
    //隐藏面消除
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT|gl.COLOR_BUFFER_BIT);
    //深度冲突 采用多边形偏移机制解决
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.polygonOffset(1.0,0.1);
    

    // gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawElements(gl.TRIANGLES,n,gl.UNSIGNED_BYTE,0);

 }

 function initMultiPointsBuffer(gl){  
    var verticesColors = new Float32Array([
        // Vertex coordinates and color
         1.0,  1.0,  1.0,     1.0,  1.0,  1.0,  // v0 White
        -1.0,  1.0,  1.0,     1.0,  0.0,  1.0,  // v1 Magenta
        -1.0, -1.0,  1.0,     1.0,  0.0,  0.0,  // v2 Red
         1.0, -1.0,  1.0,     1.0,  1.0,  0.0,  // v3 Yellow
         1.0, -1.0, -1.0,     0.0,  1.0,  0.0,  // v4 Green
         1.0,  1.0, -1.0,     0.0,  1.0,  1.0,  // v5 Cyan
        -1.0,  1.0, -1.0,     0.0,  0.0,  1.0,  // v6 Blue
        -1.0, -1.0, -1.0,     0.0,  0.0,  0.0   // v7 Black
      ]);

      // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2,   0, 2, 3,    // front
        0, 3, 4,   0, 4, 5,    // right
        0, 5, 6,   0, 6, 1,    // up
        1, 6, 7,   1, 7, 2,    // left
        7, 4, 3,   7, 3, 2,    // down
        4, 7, 6,   4, 6, 5     // back
    ]);
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建顶点缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,verticesColors,gl.STATIC_DRAW);

   
    var FSIZE =verticesColors.BYTES_PER_ELEMENT;
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');

    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,6*FSIZE,0);

    gl.enableVertexAttribArray(a_Position);
    //颜色
    var a_Color =gl.getAttribLocation(gl.program,'a_Color');
    gl.vertexAttribPointer(a_Color,3,gl.FLOAT,false,6*FSIZE,3*FSIZE);

    gl.enableVertexAttribArray(a_Color);
    
    var indexBuffer =gl.createBuffer();
    if(!indexBuffer){
        console.log('创建索引缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);
    return indices.length;
 }
 init();