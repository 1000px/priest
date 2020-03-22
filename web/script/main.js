var MCARDS = []; // 卡牌序列
var OCARDS = [];
var CHECKERS = []; // 对战区域
var COLOR = {
    mine: '#000000',
    oppenent: '#cc0033'
};
var times = 0;
var roleLabel = '';
var pre_klass = 'zone-animation';
var CURR_CARD = null;
var max_card = 0;

window.onload = function() {
    // this.initGame();
    this.resetCards();
    this.cardEventInit();
}

function initGame() {
    if(document.body.clientHeight < 920) {
        window.alert('Please change the screen device, The game need a bigger one');
    } else {
        document.getElementById('pad').style.marginTop = (document.body.clientHeight - 920)/2 + 'px';
    }
}

// 拖动事件绑定到卡牌
function cardEventInit() {
    // var cards = document.getElementsByClassName('mine-card'); // 我方卡牌放置区
    // var checkers = document.getElementsByClassName('checker'); // 对战区方格
    var _len_mcards = MCARDS.length;
    var _len_ocards = OCARDS.length;
    var _len_checkers = CHECKERS.length;
    // 为我方绑定事件
    for (var i=0; i < _len_mcards; i++) {
        mcard = MCARDS[i];
        mcard.ondragstart = drag_start;
        mcard.ondragend = drag_end;
    }
    // 为敌方绑定事件
    for(var k=0; k < _len_ocards; k++) {
        ocard = OCARDS[k];
        ocard.ondragstart = drag_start;
        ocard.ondragend = drag_end;
    }
    // fight area binding events
    for (var j=0; j < _len_checkers; j++) {
        checker = CHECKERS[j];
        checker.ondragover = drag_over;
        checker.ondrop = drop_it;
    }
}

// 事件方法 --start

// 卡牌拖动开始
function drag_start(e) {
    var data = this.getAttribute('data-cv') + ' ' + this.getAttribute('data-role');
    CURR_CARD = this;
    e.dataTransfer.setData('text', data);
    var zones = getNullZones();
    zoneBlink(zones, 1);
    removeChildrenClass(CHECKERS, pre_klass + '2');
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
        var cardval = e.dataTransfer.getData('text');
        var cardObj = {
            cv: cardval.split(' ')[0],
            role: cardval.split(' ')[1]
        };
        
        currChecker.innerHTML = CURR_CARD.innerHTML;
        
        currChecker.style.backgroundColor = COLOR[cardObj.role];
        currChecker.setAttribute('data-cv', cardObj.cv);
        currChecker.setAttribute('data-stat', 1);
        currChecker.setAttribute('data-camp', cardObj.role);
        for(var i=0; i<MCARDS.length; i++) {
            if(MCARDS[i].getAttribute('data-cv') == cardObj.cv && MCARDS[i].getAttribute('data-role') == cardObj.role) {
                nullCard(MCARDS[i]);
            }
        }
        for(var j=0; j<OCARDS.length; j++) {
            if(OCARDS[j].getAttribute('data-cv') == cardObj.cv && OCARDS[j].getAttribute('data-role') == cardObj.role) {
                nullCard(OCARDS[j]);
            }
        }
    }
    // 获取当前卡牌放置位置
    // 1 计算攻击区域
    var zones = getAttackZones(currChecker.getAttribute('data-index'));
    // 2 实施攻击
    for(var j=0; j<zones.length; j++) {
        var _here = CHECKERS[zones[j]-1];
        if(_here.getAttribute('data-camp') && _here.getAttribute('data-camp') != cardObj.role) {
            var _val_here = _here.getAttribute('data-cv');
            // if current card is joke, this card could just attack the max card of all the fighting area.
            // or if the current card is the 1 card, it just could attack the joke card
            if((cardObj.cv == 6 && _val_here == max_card) || (cardObj.cv == 1 && _val_here == 6)) {
                _here.style.backgroundColor = COLOR[cardObj.role];
                _here.setAttribute('data-camp', cardObj.role);
                addClass(_here.children[0], 'zone-animation2');
            } else if(_val_here < cardObj.cv && cardObj.cv != 6) {
                _here.style.backgroundColor = COLOR[cardObj.role];
                _here.setAttribute('data-camp', cardObj.role);
                addClass(_here.children[0], 'zone-animation2');
            }
        }
    }

    // save the max value of all card
    if(cardObj.cv > max_card && cardObj.cv != 6) {
        max_card = cardObj.cv;
    }

    var mineCount = 0;
    for(var n=0; n<CHECKERS.length; n++) {
        if(CHECKERS[n].getAttribute('data-camp') == 'mine') {
            mineCount = mineCount + 1;
        }
    }
    

    // 判断游戏是否结束，如果结束给出对战结果
    times = times + 1;
    document.getElementById('mine_score').innerText = mineCount;
    document.getElementById('oppenent_score').innerText = times - mineCount;
    if(times == 12) {
        var endStr = '';
        if(mineCount > 6) {
            endStr += '<h2>You Win!</h2>';
        } else if(mineCount == 6) {
            endStr += '<h2>Same Score!</h2>';
        } else {
            endStr += '<h2>You Lose...</h2>';
        }
        endStr += '<button onclick="resetGame()">重新开始？</button>'
        var result = document.getElementById('result');
        result.style.display = 'block';
        result.innerHTML = endStr;
    }
    
}

// 事件方法 --end

// 功能函数 --start

// 初始化卡牌
function resetCards() {
    MCARDS = document.getElementsByClassName('mine-card');
    OCARDS = document.getElementsByClassName('oppenent-card');
    CHECKERS = document.getElementsByClassName('checker');
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
    if(checkerindex - 4 > 0) {
        zones.push(checkerindex-4);
    }
    if(Math.ceil(checkerindex/4) == Math.ceil((checkerindex-1)/4)) {
        zones.push(checkerindex-1);
    }
    if(Math.ceil(checkerindex/4) == Math.ceil((checkerindex+1)/4)) {
        zones.push(checkerindex+1);
    }
    if(checkerindex + 4 <= 12) {
        zones.push(checkerindex+4);
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

// 卡牌翻面
function toggleCard(el) {
    if(el.getAttribute('data-camp') == 'mine') {
        el.setAttribute('background-color', COLOR.mine);
    } else {
        el.setAttribute('background-color', COLOR.oppenent);
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
function removeChildrenClass(els, klassname) {
    if(!els.classList && els.length > 0) {
        for(var i=0; i<els.length; i++) {
            if(els[i].children[0] && els[i].children[0].classList) {
                els[i].children[0].classList.remove(klassname);
            }
        }
    }
}
// 添加class
function addClass(el, klassname) {
    el.classList.add(klassname);
}
// 工具函数 --end

function resetGame() {
    location.replace(location.href);
}