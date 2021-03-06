var endTime = new Date();// js中月份特殊，0-11表示1-12月
endTime.setTime( endTime.getTime()+3600*1000);
var curShowTimeSeconds=0
var balls=[];
const colors=["#33B3E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#000000"]


window.onload=function(){
    WINDOW_WIDTH=document.body.clientWidth;
    WINDOW_HEIGHT=document.body.clientHeight;


    MARGIN_LEFT=Math.round(WINDOW_WIDTH/10);
    RADIUS=Math.round(WINDOW_WIDTH*4/5/108)-1;
    MARGIN_TOP=Math.round(WINDOW_HEIGHT/5);

    var canvas=document.getElementById('canvas');
    var context=canvas.getContext("2d");

    canvas.width=WINDOW_WIDTH;
    canvas.height=WINDOW_HEIGHT;

    curShowTimeSeconds=getCurrentShowTImeSeconds(); //本次render使用的倒计时时间（时间差）
    setInterval(
        function(){
            render(context);
            update();
        },
        50
    );
}


function getCurrentShowTImeSeconds(){  //计算倒计时时间
    var curTime=new Date();
    var ret=curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();


    return ret>=0?ret:0;
}

function update(){
    var nextShowTimeSeconds=getCurrentShowTImeSeconds();//render后再次计算倒计时


    var nextHours=parseInt(nextShowTimeSeconds/3600);    //计算当前时间
    var nextMinutes=parseInt((nextShowTimeSeconds-nextHours*3600)/60);
    var nextSeconds=nextShowTimeSeconds%60;

    var curHours=parseInt(curShowTimeSeconds/3600);        //计算render时间（上一次）
    var curMinutes=parseInt((curShowTimeSeconds-curHours*3600)/60);
    var curSeconds=curShowTimeSeconds%60;

    if(nextSeconds!=curSeconds){
        if(parseInt(curHours/10)!=parseInt(nextHours/10)){    //小时的十位数
            addBalls(MARGIN_LEFT+0,MARGIN_TOP,parseInt(nextHours/10));
        }
        if(parseInt(curHours%10)!=parseInt(nextHours%10)){    //小时的个位数
            addBalls(MARGIN_LEFT+15*(RADIUS+1),MARGIN_TOP,parseInt(nextHours%10));
        }
        if(parseInt(curMinutes/10)!=parseInt(nextMinutes/10)){    //分钟的十位数
            addBalls(MARGIN_LEFT+39*(RADIUS+1),MARGIN_TOP,parseInt(nextMinutes/10));
        }
        if(parseInt(curMinutes%10)!=parseInt(nextMinutes%10)){    //分钟的个位数
            addBalls(MARGIN_LEFT+54*(RADIUS+1),MARGIN_TOP,parseInt(nextMinutes%10));
        }
        if(parseInt(curSeconds/10)!=parseInt(nextSeconds/10)){    //秒钟的十位数
            addBalls(MARGIN_LEFT+78*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds/10));
        }
        if(parseInt(curSeconds%10)!=parseInt(nextSeconds%10)){    //秒钟的个位数
            addBalls(MARGIN_LEFT+93*(RADIUS+1),MARGIN_TOP,parseInt(nextSeconds%10));
        }
        curShowTimeSeconds=nextShowTimeSeconds;
    }


    updateBalls();
}
function updateBalls(){
    for(var i=0;i<balls.length;i++){
        balls[i].x+=balls[i].vx;
        balls[i].y+=balls[i].vy;
        balls[i].vy+=balls[i].g;

        if(balls[i].y>=WINDOW_HEIGHT-RADIUS){
            balls[i].y=WINDOW_HEIGHT-RADIUS;
            balls[i].vy=-balls[i].vy*0.75;
        }
    }
    var cnt=0;
    for(var i=0;i<balls.length;i++){
        if(balls[i].x+RADIUS>0&&balls[i].x-RADIUS<WINDOW_WIDTH){
            balls[cnt++]=balls[i];
        }
    }
    while (balls.length>Math.min(300,cnt)) {
        balls.pop();
    }
}
function addBalls(x,y,num){
    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                var aBall={
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:1.5+Math.random(),
                    vx:Math.pow(-1,Math.ceil(Math.random()*1000))*4,
                    vy:-5,
                    color:colors[Math.floor(Math.random()*colors.length)]
                }

                balls.push(aBall);
            }
        }
    }
}

function render(cxt){                     //主要渲染静态页面函数
    cxt.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);//防止render重叠，对整个页面进行刷新
    var hours=parseInt(curShowTimeSeconds/3600);
    var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
    var seconds=curShowTimeSeconds%60;

    renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt )
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt )
    renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt )
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);

    for(var i=0;i<balls.length;i++){
        cxt.fillStyle=balls[i].color;

        cxt.beginPath();
        cxt.arc(balls[i].x,balls[i].y,RADIUS,0,2*Math.PI,true);
        cxt.closePath();

        cxt.fill();
    }
}

function renderDigit(x,y,num,cxt){
    cxt.fillStyle='rgb(1,102,153)';

    for(var i=0;i<digit[num].length;i++){
        for(var j=0;j<digit[num][i].length;j++){
            if(digit[num][i][j]==1){
                cxt.beginPath();
                cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1),y+i*2*(RADIUS+1)+(RADIUS+1),RADIUS,0,2*Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}
