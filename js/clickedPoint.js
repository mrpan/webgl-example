var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'void main() {\n'+
 ' gl_Position=a_Position;\n'+
 ' gl_PointSize=10.0;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'uniform vec4 u_FragColor;\n'+
 'void main() {\n'+
 '  gl_FragColor=u_FragColor;\n'+
 '}\n';

 function init(){
    var canvas =document.getElementById("canvas");
    var gl =createGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var u_FragColor =gl.getUniformLocation(gl.program,'u_FragColor');
    gl.clearColor(0.0, 0.0, 0.0, 0.5);

    gl.clear(gl.COLOR_BUFFER_BIT);
    canvas.onmousedown=function(evt){
        click(evt,gl,canvas,a_Position,u_FragColor);
    }
 }
    var g_points=[];
    var g_colors=[];
 function click(evt,gl,canvas,a_Position,u_FragColor){
    var x= evt.clientX;
    var y =evt.clientY;
    var rect =evt.target.getBoundingClientRect();
    x=((x-rect.left)-canvas.width/2)/(canvas.width/2);
    y=-((y-rect.top)-canvas.height/2)/(canvas.height/2);
    g_points.push([x,y]);
    if(x>=0&&y>=0){
        g_colors.push([1.0,0.0,0.0,1.0])//红色
    }else if(x<0&&y<0){
        g_colors.push([0.0,1.0,0.0,1.0])//绿色

    }else{
        g_colors.push([1.0,1.0,1.0,1.0])//白色

    }

    gl.clearColor(0.5, 1.0, 0.3, 0.5);

    gl.clear(gl.COLOR_BUFFER_BIT);

    var len =g_points.length;
    console.log(g_points)
    for(var i=0;i<len;i+=1){
        var xy =g_points[i];
        var rgba=g_colors[i];
        gl.vertexAttrib3f(a_Position,xy[0],xy[1],0.0);
        gl.uniform4f(u_FragColor,rgba[0],rgba[1],rgba[2],rgba[3]);
        gl.drawArrays(gl.POINTS,0,1);
    }
 }
 init();
