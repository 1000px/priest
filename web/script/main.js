var CARDS = []; // 卡牌序列
var CHECKERS = []; // 对战区域
var COLORS = [{
    label: 'mine',
    bg: '#7B9BC1'
}, {
    label: 'enemy',
    bg: '#DF8C88'
}];
var pre_klass = 'zone-animation';

window.onload = function() {
    this.resetCards('mine-card', 'checker');
    this.cardEventInit();
}

// 拖动事件绑定到卡牌
function cardEventInit() {
    // var cards = document.getElementsByClassName('mine-card'); // 我方卡牌放置区
    var checkers = document.getElementsByClassName('checker'); // 对战区方格
    var _len_cards = CARDS.length;
    var _len_checkers = checkers.length;
    for (var i=0; i < _len_cards; i++) {
        card = CARDS[i];
        card.ondragstart = drag_start;
        card.ondragend = drag_end;
    }
    for (var j=0; j < _len_checkers; j++) {
        checker = checkers[j];
        checker.ondragover = drag_over;
        checker.ondrop = drop_it;
    } 
}

// 事件方法 --start

// 卡牌拖动开始
function drag_start(e) {
    e.dataTransfer.setData('cardVal', this.getAttribute('data-cv'));
    var zones = getNullZones();
    zoneBlink(zones, 1);
}

// 卡牌拖动过程
function drag_over(e) {
    e.preventDefault();
    e.stopPropagation();
}

// 卡牌拖放结束：释放卡牌
function drag_end(e) {
}

// 卡牌放置到目标位置
function drop_it(e) {
    e.preventDefault();
    e.stopPropagation();
    var currChecker = e.target;
    // 将闪动区域的动画效果去除
    removeClass(CHECKERS, pre_klass + '1');
    if(currChecker.getAttribute('data-stat') == 0) {
        // 获取当前被拖动的卡牌数据
        var cardVal = e.dataTransfer.getData('cardVal');
        currChecker.innerHTML = cardVal;
        currChecker.setAttribute('data-stat', 1);
        for(var i=0; i<CARDS.length; i++) {
            if(CARDS[i].getAttribute('data-cv') == cardVal) {
                CARDS[i].setAttribute('draggable', false);
            }
        }
    }
    // 获取当前卡牌放置位置
    // 1 计算攻击区域
    var zones = getAttackZones(currChecker.getAttribute('data-index'));
    // 2 实施攻击
    console.log('应该攻击的区域为：', zones);

}

// 事件方法 --end

// 功能函数 --start

// 初始化卡牌
function resetCards(cardname, zonename) {
    CARDS = document.getElementsByClassName(cardname);
    CHECKERS = document.getElementsByClassName(zonename);
}

// 我方卡牌拖动结束后 重置卡位
function nullCard(card) {
    card.setAttribute('draggable', false);
    card.innerHTML = null;
}

// 计算卡牌攻击范围
function getAttackZones(_checkerindex) {
    var checkerindex = parseInt(_checkerindex);
    if(!isInt(checkerindex)) {
        console.error(101, 'Get the wrong checker index, it should be one number');
        return;
    }
    if(checkerindex > 12 || checkerindex < 1) {
        console.error(102, 'Get the wrong checker index, it should be inner at [0, 11]');
        return;
    }

    var zones = [];
    if(checkerindex - 3 > 0) {
        zones.push(checkerindex-3);
    }
    if(Math.ceil(checkerindex/3) == Math.ceil((checkerindex-1)/3)) {
        zones.push(checkerindex-1);
    }
    if(Math.ceil(checkerindex/3) == Math.ceil((checkerindex+1)/3)) {
        zones.push(checkerindex+1);
    }
    if(checkerindex + 3 < 12) {
        zones.push(checkerindex+3);
    }
    return zones;
}
// 获取空置区域
function getNullZones() {
    var zones = [];
    var _len_checkers = CHECKERS.length;
    if(_len_checkers > 0) {
        for(var i=0; i<_len_checkers; i++) {
            var el = CHECKERS[i];
            if(el.getAttribute('data-stat') == 0) {
                zones.push(parseInt(el.getAttribute('data-index')))
            }
        }
    }
    return zones;
}

// 区域闪动提醒
function zoneBlink(zones, level) {
    // zones为闪动区域元素的data-index属性值的数组
    // level为区域闪动等级（一共三级）
    var _len_checkers = CHECKERS && CHECKERS.length;
    if(zones.length > 0) {
        var klassname = pre_klass + level;
        var _len_checkers = zones.length;
        for(var i=0; i<_len_checkers; i++) {
            var el = CHECKERS[zones[i]-1];
            addClass(el, klassname);
        }
    }
}
// 功能函数 --end

// 工具函数 --start

// 判断是否为整数
function isInt(val) {
    return val % 1 == 0;
}
// 删除class
function removeClass(els, klassname) {
    // el.classList.remove(klassname);
    if(!els.classList && els.length > 0) {
        for(var i=0; i<els.length; i++) {
            if(els[i].classList) {
                els[i].classList.remove(klassname);
            }
        }
    }
}
// 添加class
function addClass(el, klassname) {
    el.classList.add(klassname);
}
// 工具函数 --end