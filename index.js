

/**初始化 */
function initPage() {
    var snowStyle = {
        1: document.querySelector("#snow1"),
        2: document.querySelector("#snow2"),
        3: document.querySelector("#snow3"),
        4: document.querySelector("#snow4")
    }
    var canvasHeight = window.innerHeight;
    var canvasWidth = 375;
    var myCanvas = document.querySelector('#happy-new-year');
    myCanvas.setAttribute('height',canvasHeight);
    myCanvas.setAttribute('width',canvasWidth);
    
    var ctx = myCanvas.getContext('2d');

    // 初始化数据
    var num = 75;
    var sonwPoints = getSonws();
    var wordPoints = getWords();
    var starPoints = getStar();

    //console.log(wordPoints);
    // 渲染动画
    var rid = window.requestAnimationFrame(step);
    function step(){
        ctx.clearRect(0,0,canvasWidth,canvasHeight);
        // 背景
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0,canvasWidth,canvasHeight);

        initSnow();
        initWord();
        initStar();
        rid = window.requestAnimationFrame(step);
    }
    
    
    // 雪花文字动画
    function initWord() {
        var range = 25;
        for (var i = 0; i < wordPoints.length; i++) {
            var x = wordPoints[i].x;
            var y = wordPoints[i].y;
            var endx = wordPoints[i].endx;
            var endy = wordPoints[i].endy;
            var height = wordPoints[i].height;
            var width = wordPoints[i].width;
            var moveRange = wordPoints[i].moveRange;
            var delay = wordPoints[i].delay;
            var delayCount = wordPoints[i].delayCount;
            var offset = wordPoints[i].offset;
            var img = wordPoints[i].img;
            range = moveRange + 2;
            x = x + Math.sin(range / 360 * 2 * Math.PI) * offset;
            y = y + 1.5;
            if (delayCount < delay) {
                delayCount++;
                wordPoints[i].delayCount = delayCount;
                continue;
            }
            if(y >= endy){
                x = endx;
                y = endy;
            }
            wordPoints[i].x = x;
            wordPoints[i].y = y;
            wordPoints[i].moveRange = range;
            ctx.beginPath();
            ctx.drawImage(snowStyle[img], x, y, height, width);
        }
    }
    // 雪花动画
    function initSnow() {
        var range = 25;
        for (var i = 0; i < num; i++) {
            var x = sonwPoints[i].x;
            var y = sonwPoints[i].y;
            var moveRange = sonwPoints[i].moveRange;
            var offset = sonwPoints[i].offset;
            var delay = sonwPoints[i].delay;
            var delayCount = sonwPoints[i].delayCount;
            var img = sonwPoints[i].img;
            var height = sonwPoints[i].height;
            var width = sonwPoints[i].width;
            range = moveRange + 2;
            x = x + Math.sin(range / 360 * 2 * Math.PI) * offset;
            y = y + 1.5;
            if (y > canvasHeight) { y = 0; }
            if (delayCount < delay) {
                delayCount++;
                sonwPoints[i].delayCount = delayCount;
                continue;
            }
            sonwPoints[i].x = x;
            sonwPoints[i].y = y;
            sonwPoints[i].moveRange = range;
            ctx.beginPath();
            ctx.drawImage(snowStyle[img], x, y, height, width);
        }
    }
    // 流星文字动画
    function initStar() {
        ctx.save();
        var words = ['by','小','傻','师','哥','祝'];
        for(var i=0;i<5;i++){
            var point = starPoints[i];
            ctx.beginPath();
            if(point.delay > point.delayCount){
                point.delayCount +=1; 
                continue;
            }
            if(point.y >= point.endy){
                point.x = point.endx;
                point.y = point.endy;
                ctx.font = '20px xxoo';
                //画布渐变
                var gradient = ctx.createLinearGradient(200,480,320,480);
                gradient.addColorStop(0,"#FF0000");
                gradient.addColorStop(0.5,"#FF8000");
                gradient.addColorStop(0.75,"#FFFF00");
                gradient.addColorStop(1,"#7F00FF");
                ctx.fillStyle = gradient;
                ctx.fillText(words[i],starPoints[i].endx,480);
            }else{
                var rangeX = 100;
                var rangeY = 100;
                point.x = point.x+5;
                point.y = point.y+5;
                ctx.fillStyle = point.color;
                ctx.arc(point.x,point.y,5,0,2*Math.PI);
                var tp = returnQD(point.x,point.y,point.x-rangeX,point.y-rangeY,5);
                ctx.moveTo(point.x-rangeX,point.y-rangeY);
                ctx.lineTo(tp[0].x,tp[0].y);
                ctx.lineTo(tp[1].x,tp[1].y);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    // 雪花文字点
    function getWords() {
        // 名字
        var name = window.decodeURIComponent(window.location.search.split('=')[1]);
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = '75px ooxx';
        ctx.fillText(name,(canvasWidth-75*name.length)/2,canvasHeight/2-100);
        ctx.restore();

        // 祝福语
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = '90px ooxx';
        ctx.fillText('新',(canvasWidth-90*4)/2,canvasHeight/2+10);
        ctx.fillText('年',(canvasWidth-90*4)/2+90,canvasHeight/2+25)
        ctx.fillText('快',(canvasWidth-90*4)/2+180,canvasHeight/2+10)
        ctx.fillText('乐',(canvasWidth-90*4)/2+270,canvasHeight/2+25)
        ctx.restore();

        // 获取原始点坐标，色值
        var iData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
        var colorsData = iData.data;
        var points = [];
        // 取点
        for(var i=1; i<= canvasWidth; i+=6){
            for(var j=1; j<= canvasHeight; j+=6){
                var x = i;
                var y = j;
                var index = canvasWidth*(j-1)+i;
                var a = colorsData[(index-1)*4+3];
                if(a > 0){
                    var size = Math.round(Math.random()*5+8);
                    var config = {
                        x:x,
                        y:0,
                        endx:x,
                        endy:y,
                        height:size,
                        width:size,
                        offset:1,
                        moveRange:2,
                        delay:Math.round(Math.random()*canvasHeight)
                    }
                    var point = new SnowPixel(config);
                    points.push(point);
                }
            }
        }
        return points;
    }
    // 雪花点
    function getSonws() {
        var pointsArry = [];
        for (var i = 0; i < num; i++) {
            var size = Math.round(Math.random()*15+15);
            var config = {
                x: Math.round(Math.random() * canvasWidth),
                y: 0,
                endx: canvasWidth,
                endy: canvasHeight,
                height: size,
                width: size,
                offset: (Math.random() * 1.5).toFixed(1),
                moveRange: Math.round(Math.random() * 10),
                delay: Math.round(Math.random() * canvasHeight)
            }
            var point = new SnowPixel(config);
            pointsArry.push(point);
        }
        return pointsArry;
    }
    // 流星点
    function getStar() {
        let points = [];
        for(let i=0;i<6;i++){
            let point = new StarPixel(250+20*i-450,0,200+25*i+i*7,480,i);
            points.push(point);
        }
        return points;
    }
    function StarPixel(x,y,endx,endy,color){
        var colors = ['#FF0000','#FF8000','#FFFF00','#7F00FF'];
        // 起点
        this.x = x;
        this.y = y;
        // 终点
        this.endx = endx;
        this.endy = endy;
        this.color = colors[color];
        this.delay = Math.random()*100+200;
        this.delayCount = 0;
    }
    function SnowPixel(config) {
        this.x = config['x']||0;
        this.y = config['y']||0;
        this.endx = config['endx']||0;
        this.endy = config['endy']||0;
        this.height = config['height']||5;
        this.width = config['width']||5;
        this.offset = config['offset']||1;
        this.moveRange = config['moveRange']||1;
        this.delay = config['delay']||0;
        this.delayCount = 0;
        this.img = config['img']||Math.round(Math.random()*3+1);
    }
    // 返回切点位置
    function returnQD(cx,cy,x,y,radius){
        var __dx = cx - x;
        var __dy = cy - y;
        //计算点击处与圆心相对于X轴的夹角
        var __r1 = Math.atan2(__dy, __dx);
        //计算点击处与圆心、点击处与切点1这两条线段间的夹角
        var __d1 = Math.sqrt(__dx*__dx + __dy*__dy);
        var __r2 = Math.asin(radius/__d1);
        //计算从切点1向圆的垂直直径做垂线形成的直角三角形的一个角
        var __r3 = __r1 - __r2;
        //计算坐标系中的角度
        var __r4 = __r3 - Math.PI/2;
        //计算切点1相对于圆心的x、y坐标
        var __x1 = radius * Math.cos(__r4);
        var __y1 = radius * Math.sin(__r4);

        //计算点击处与切线2相对于X轴的夹角
        var __r5 = Math.PI/2 - __r1 - __r2;
        //计算坐标系中的角度
        var __r6 = -__r5;
        //计算切点2相对于圆心的x、y坐标
        var __x2 = radius * Math.cos(__r6);
        var __y2 = radius * Math.sin(__r6);
        return [{x:cx+__x1,y:cy+__y1},{x:cx-__x2,y:cy-__y2}]
    }
}
window.addEventListener("DOMContentLoaded", function () {
    initPage();
});