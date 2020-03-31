var VSHADER_SOURCE=
'attribute vec4 a_Position;\n'+
'attribute vec2 a_TexCoord;\n'+
'varying vec2 v_TexCoord;\n' +
'void main() {\n'+
 ' gl_Position=a_Position;\n'+
 ' v_TexCoord=a_TexCoord;\n'+
 '}\n';

 var FSHADER_SOURCE =
 'precision mediump float;\n'+
 'uniform sampler2D u_Sampler0;\n'+
 'uniform sampler2D u_Sampler1;\n'+
 'varying vec2 v_TexCoord;\n' +
 'void main() {\n'+
 '  vec4 v_Color0=texture2D(u_Sampler0,v_TexCoord);\n'+
 '  vec4 v_Color1=texture2D(u_Sampler1,v_TexCoord);\n'+
 '  gl_FragColor=v_Color0*v_Color1;\n'+
 '}\n';

 function init(){
    var canvas =document.getElementById("canvas");
    var gl =createGLContext(canvas);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('初始化着色器失败.');
        return;
    }
    var n = initVertexBuffer(gl);
    if(!initTexture(gl,n)){
        console.log("配置纹理失败");
    }

 }
 function initVertexBuffer(gl){
    var n =4;
    // var verticesTexCoords =new Float32Array([
    //     -0.5,0.5,0.0,1.0,
    //     -0.5,-0.5,0.0,0.0,
    //     0.5,0.5,1.0,1.0,
    //     0.5,-0.5,1.0,0.0
    // ])
    var verticesTexCoords =new Float32Array([
        -1.0,1.0,0.0,1.0,
        -1.0,-1.0,0.0,0.0,
        1.0,1.0,1.0,1.0,
        1.0,-1.0,1.0,0.0
    ])
    // var verticesTexCoords =new Float32Array([
    //     -0.5,0.5,-1.3,1.7,
    //     -0.5,-0.5,-1.3,-0.2,
    //     0.5,0.5,1.7,1.7,
    //     0.5,-0.5,1.7,-0.2
    // ])
    var buffer =gl.createBuffer();
    if(!buffer){
        console.log('创建缓冲区失败');
        return false;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    
    gl.bufferData(gl.ARRAY_BUFFER,verticesTexCoords,gl.STATIC_DRAW);

   

    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    var FSIZE =verticesTexCoords.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,FSIZE*4,0);

    gl.enableVertexAttribArray(a_Position);
    //纹理坐标分配给a_TexCoord
    var a_TexCoord =gl.getAttribLocation(gl.program,'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord,2,gl.FLOAT,false,FSIZE*4,2*FSIZE);
    gl.enableVertexAttribArray(a_TexCoord);
    return n;
 }

 function initTexture(gl,n){
     var texture =gl.createTexture();//创建纹理对象
     var texture2 =gl.createTexture();//创建纹理对象

     //获取u_Sampler的存储位置
     var u_Sampler0 = gl.getUniformLocation(gl.program,'u_Sampler0');
     var u_Sampler1 = gl.getUniformLocation(gl.program,'u_Sampler1');

     var image = new Image();
     var image2 =new Image();
     
     image.onload=function(){
         loadTexture(gl,texture,n,u_Sampler0,image,0);
        
     }
     image2.onload=function(){
        loadTexture(gl,texture2,n,u_Sampler1,image2,1);
     }
    //  image.src='../resources/sky_cloud.jpg';
    image.src='../resources/map.png';
    image2.src ='../resources/sky_cloud.jpg';
     return true;
 }
 var g_texUnit0=false,g_texUnit1=false;
 function loadTexture(gl,texture,n,u_Sampler,image,texUnit){
     gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);//图像坐标与纹理坐标Y轴相反，需进行反转；
    if(texUnit==0){
        gl.activeTexture(gl.TEXTURE0)//webgl至少支持8个纹理单元
        g_texUnit0=true;
    }else if(texUnit==1){
        gl.activeTexture(gl.TEXTURE1)//webgl至少支持8个纹理单元
        g_texUnit1=true;
    }

     gl.bindTexture(gl.TEXTURE_2D,texture);//绑定纹理对象到纹理单元
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);//设置纹理参数
    if(texUnit==0){
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);//设置纹理参数，水平填充
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);//设置纹理参数,竖直填充
    }else if(texUnit==1){
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);//设置纹理参数，水平填充
    //  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.MIRRORED_REPEAT);
    //  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.MIRRORED_REPEAT);
    }
   
     
   


     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);
     //将0号纹理单元传递给着色器中的取样器变量
     gl.uniform1i(u_Sampler,texUnit);

     gl.clearColor(0.0, 0.0, 0.0, 0.5);//设置背景颜色
     gl.clear(gl.COLOR_BUFFER_BIT);
     console.log(g_texUnit0+"="+g_texUnit1)
     if(g_texUnit0&&g_texUnit1){
        gl.drawArrays(gl.TRIANGLE_STRIP,0,n);
     }
     
 }
 init();