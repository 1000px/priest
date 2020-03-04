var print = console.log;
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
    print('drag start ...');
    e.dataTransfer.setData('cardVal', this.getAttribute('data-cv'));
    var zones = getNullZones();
    zoneBlink(zones, 1);
}

// 卡牌拖动过程
function drag_over(e) {
    e.preventDefault();
    e.stopPropagation();
    print('drag over');
}

// 卡牌拖放结束：释放卡牌
function drag_end(e) {
    print('drag end');
}

// 卡牌放置到目标位置
function drop_it(e) {
    e.preventDefault();
    e.stopPropagation();
    print('drop on it');
    removeClass(pre_klass + '1');
    var currentCard = e.dataTransfer.getData('cardVal');
    e.target.innerHTML = currentCard;
    var zones = getAttackZones(currentCard);
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
        print('对战区域位置参数错误。');
        return;
    }
    if(checkerindex > 12 || checkerindex < 1) {
        print('对战区域位置参数错误。');
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
function removeClass(el, klassname) {
    el.classList.remove(klassname);
}
// 添加class
function addClass(el, klassname) {
    el.classList.add(klassname);
}
// 工具函数 --end