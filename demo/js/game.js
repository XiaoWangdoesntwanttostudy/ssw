// ==================== 游戏配置 ====================
const CONFIG = {
    // 画布尺寸
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // 玩家配置
    PLAYER_SPEED: 200,
    PLAYER_DASH_SPEED: 500,
    PLAYER_DASH_DURATION: 200,
    PLAYER_DASH_COOLDOWN: 1000,
    
    // 侵蚀度配置
    CORROSION_RATE: 5, // 每分钟增加百分比
    
    // 撤离配置
    EVACUATE_TIME: 5000, // 撤离时间(毫秒)
    
    // 背包配置
    INVENTORY_SIZE: 20,
};

// ==================== 游戏数据 ====================
const GameData = {
    // 猎手职业
    classes: {
        swordsman: { name: '剑士', icon: '⚔️', hp: 120, mp: 40, atk: 15, def: 10, skills: ['slash', 'block', 'dash', 'fury'] },
        berserker: { name: '狂战士', icon: '🪓', hp: 150, mp: 30, atk: 20, def: 5, skills: ['cleave', 'rage', 'dash', 'execute'] },
        thief: { name: '盗贼', icon: '🗡️', hp: 80, mp: 60, atk: 18, def: 5, skills: ['backstab', 'stealth', 'dash', 'poison'] },
        ranger: { name: '游侠', icon: '🏹', hp: 90, mp: 50, atk: 16, def: 6, skills: ['shoot', 'trap', 'dash', 'multishot'] },
        mage: { name: '法师', icon: '🔮', hp: 70, mp: 100, atk: 8, def: 4, skills: ['fireball', 'frost', 'blink', 'meteor'] },
        priest: { name: '牧师', icon: '✨', hp: 85, mp: 90, atk: 6, def: 6, skills: ['heal', 'smite', 'dash', 'resurrect'] },
    },
    
    // 区域配置
    areas: {
        tomb: { name: '遗忘墓穴', icon: '💀', difficulty: 1, levelReq: 1, color: '#2d3748', enemies: ['skeleton', 'zombie', 'ghost'] },
        forest: { name: '腐朽森林', icon: '🌲', difficulty: 2, levelReq: 8, color: '#1a4731', enemies: ['wolf', 'spider', 'treant'] },
        mine: { name: '废弃矿坑', icon: '⛏️', difficulty: 2, levelReq: 8, color: '#78350f', enemies: ['goblin', 'bat', 'golem'], locked: true },
    },
    
    // 敌人配置
    enemies: {
        skeleton: { name: '骷髅', icon: '💀', hp: 30, atk: 8, def: 2, exp: 10, drops: ['bone', 'rusty_sword'] },
        zombie: { name: '僵尸', icon: '🧟', hp: 50, atk: 10, def: 3, exp: 15, drops: ['rotten_flesh', 'cloth'] },
        ghost: { name: '幽灵', icon: '👻', hp: 25, atk: 12, def: 0, exp: 12, drops: ['ectoplasm', 'soul_shard'] },
        wolf: { name: '腐狼', icon: '🐺', hp: 40, atk: 14, def: 3, exp: 18, drops: ['wolf_pelt', 'fang'] },
        spider: { name: '巨蛛', icon: '🕷️', hp: 35, atk: 11, def: 2, exp: 14, drops: ['spider_silk', 'venom'] },
        treant: { name: '树人', icon: '🌳', hp: 80, atk: 16, def: 8, exp: 30, drops: ['ancient_bark', 'life_essence'] },
    },
    
    // 物品配置
    items: {
        // 消耗品
        health_potion: { name: '生命药水', icon: '🧪', type: 'consumable', effect: { hp: 50 }, price: 50 },
        mana_potion: { name: '魔力药水', icon: '🧪', type: 'consumable', effect: { mp: 30 }, price: 40 },
        // 材料
        bone: { name: '骨头', icon: '🦴', type: 'material', price: 5 },
        rusty_sword: { name: '锈剑', icon: '🗡️', type: 'material', price: 15 },
        rotten_flesh: { name: '腐肉', icon: '🥩', type: 'material', price: 3 },
        cloth: { name: '布料', icon: '🧵', type: 'material', price: 8 },
        ectoplasm: { name: '灵质', icon: '💧', type: 'material', price: 20 },
        soul_shard: { name: '灵魂碎片', icon: '💎', type: 'material', price: 50 },
        wolf_pelt: { name: '狼皮', icon: '🐾', type: 'material', price: 25 },
        fang: { name: '尖牙', icon: '🦷', type: 'material', price: 12 },
        spider_silk: { name: '蛛丝', icon: '🕸️', type: 'material', price: 18 },
        venom: { name: '毒液', icon: '☠️', type: 'material', price: 30 },
        ancient_bark: { name: '古树皮', icon: '🪵', type: 'material', price: 35 },
        life_essence: { name: '生命精华', icon: '💚', type: 'material', price: 60 },
        gold_coin: { name: '金币', icon: '🪙', type: 'currency', price: 1 },
    },
    
    // 商店物品
    shopItems: ['health_potion', 'mana_potion'],
};

// ==================== 游戏状态 ====================
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.currentState = 'boot';
        this.gold = 1000;
        this.souls = 50;
        this.storage = [
            { id: 'health_potion', count: 5 },
            { id: 'mana_potion', count: 3 },
        ];
        this.hunters = [
            this.createHunter('艾伦', 'swordsman', 10),
            this.createHunter('琳达', 'mage', 8),
            this.createHunter('马克', 'ranger', 5),
        ];
        this.selectedHunter = null;
        this.selectedArea = null;
        this.prepStep = 0;
        this.exploreState = null;
    }
    
    createHunter(name, classId, level) {
        const classData = GameData.classes[classId];
        return {
            id: Math.random().toString(36).substr(2, 9),
            name: name,
            class: classId,
            level: level,
            exp: 0,
            expToNext: level * 100,
            maxHp: classData.hp + (level - 1) * 10,
            currentHp: classData.hp + (level - 1) * 10,
            maxMp: classData.mp + (level - 1) * 5,
            currentMp: classData.mp + (level - 1) * 5,
            atk: classData.atk + (level - 1) * 2,
            def: classData.def + (level - 1) * 1,
            status: 'healthy', // healthy, injured, dead
            equipment: {},
        };
    }
}

// ==================== 探索状态 ====================
class ExploreState {
    constructor(hunter, area) {
        this.hunter = { ...hunter };
        this.area = area;
        this.areaData = GameData.areas[area];
        
        // 玩家状态
        this.hp = this.hunter.currentHp;
        this.maxHp = this.hunter.maxHp;
        this.mp = this.hunter.currentMp;
        this.maxMp = this.hunter.maxMp;
        
        // 侵蚀度
        this.corrosion = 0;
        this.lastCorrosionTime = Date.now();
        
        // 位置
        this.x = 400;
        this.y = 300;
        this.facing = 'right';
        
        // 移动
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDashing = false;
        this.dashCooldown = 0;
        
        // 战斗
        this.isAttacking = false;
        this.attackCooldown = 0;
        this.skillCooldowns = [0, 0, 0, 0];
        
        // 背包
        this.inventory = [
            { id: 'health_potion', count: 3 },
            { id: 'mana_potion', count: 2 },
        ];
        
        // 拾取物品
        this.loot = [];
        
        // 敌人
        this.enemies = [];
        this.spawnEnemies();
        
        // 撤离点
        this.evacuationPoints = [
            { x: 750, y: 550, radius: 40 },
        ];
        this.isNearEvacuation = false;
        this.isEvacuating = false;
        this.evacuateProgress = 0;
        
        // 统计
        this.stats = {
            kills: 0,
            eliteKills: 0,
            damageDealt: 0,
            damageTaken: 0,
            itemsCollected: 0,
            time: 0,
        };
        
        this.startTime = Date.now();
        this.isPaused = false;
    }
    
    spawnEnemies() {
        const count = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            this.spawnEnemy();
        }
    }
    
    spawnEnemy() {
        const enemyTypes = this.areaData.enemies;
        const typeId = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemyData = GameData.enemies[typeId];
        
        this.enemies.push({
            id: Math.random().toString(36).substr(2, 9),
            type: typeId,
            ...enemyData,
            currentHp: enemyData.hp,
            x: 100 + Math.random() * 600,
            y: 100 + Math.random() * 400,
            velocityX: 0,
            velocityY: 0,
            state: 'idle',
            targetX: 0,
            targetY: 0,
            attackCooldown: 0,
        });
    }
    
    update(deltaTime) {
        if (this.isPaused) return;
        
        // 更新侵蚀度
        const now = Date.now();
        const elapsed = (now - this.lastCorrosionTime) / 1000 / 60; // 分钟
        this.corrosion = Math.min(100, this.corrosion + CONFIG.CORROSION_RATE * elapsed);
        this.lastCorrosionTime = now;
        
        // 侵蚀伤害
        if (this.corrosion >= 80) {
            this.hp -= deltaTime * 0.01 * (this.corrosion - 80);
        }
        
        // 更新统计时间
        this.stats.time = Math.floor((now - this.startTime) / 1000);
        
        // 更新冷却
        this.dashCooldown = Math.max(0, this.dashCooldown - deltaTime);
        this.attackCooldown = Math.max(0, this.attackCooldown - deltaTime);
        for (let i = 0; i < 4; i++) {
            this.skillCooldowns[i] = Math.max(0, this.skillCooldowns[i] - deltaTime);
        }
        
        // 更新位置
        if (!this.isDashing) {
            this.x += this.velocityX * deltaTime / 1000;
            this.y += this.velocityY * deltaTime / 1000;
        }
        
        // 边界限制
        this.x = Math.max(20, Math.min(780, this.x));
        this.y = Math.max(20, Math.min(580, this.y));
        
        // 更新敌人
        this.updateEnemies(deltaTime);
        
        // 检查撤离点
        this.checkEvacuation(deltaTime);
        
        // 检查拾取
        this.checkLootPickup();
        
        // 检查死亡
        if (this.hp <= 0 || this.corrosion >= 100) {
            return 'dead';
        }
        
        // 检查撤离完成
        if (this.evacuateProgress >= CONFIG.EVACUATE_TIME) {
            return 'evacuated';
        }
        
        return 'exploring';
    }
    
    updateEnemies(deltaTime) {
        for (const enemy of this.enemies) {
            if (enemy.currentHp <= 0) continue;
            
            const dx = this.x - enemy.x;
            const dy = this.y - enemy.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // AI状态机
            if (dist < 200) {
                enemy.state = 'chase';
                const speed = 80;
                enemy.velocityX = (dx / dist) * speed;
                enemy.velocityY = (dy / dist) * speed;
            } else if (dist < 300) {
                enemy.state = 'alert';
                enemy.velocityX = 0;
                enemy.velocityY = 0;
            } else {
                enemy.state = 'idle';
                // 随机移动
                if (Math.random() < 0.01) {
                    enemy.velocityX = (Math.random() - 0.5) * 50;
                    enemy.velocityY = (Math.random() - 0.5) * 50;
                }
            }
            
            // 更新位置
            enemy.x += enemy.velocityX * deltaTime / 1000;
            enemy.y += enemy.velocityY * deltaTime / 1000;
            enemy.x = Math.max(20, Math.min(780, enemy.x));
            enemy.y = Math.max(20, Math.min(580, enemy.y));
            
            // 攻击
            enemy.attackCooldown = Math.max(0, enemy.attackCooldown - deltaTime);
            if (dist < 40 && enemy.attackCooldown <= 0) {
                const damage = Math.max(1, enemy.atk - this.hunter.def);
                this.hp -= damage;
                this.stats.damageTaken += damage;
                enemy.attackCooldown = 1000;
            }
        }
    }
    
    checkEvacuation(deltaTime) {
        let nearEvac = false;
        for (const point of this.evacuationPoints) {
            const dx = this.x - point.x;
            const dy = this.y - point.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < point.radius) {
                nearEvac = true;
                break;
            }
        }
        
        this.isNearEvacuation = nearEvac;
        
        if (this.isEvacuating) {
            if (!nearEvac) {
                this.isEvacuating = false;
                this.evacuateProgress = 0;
            } else {
                this.evacuateProgress += deltaTime;
            }
        }
    }
    
    checkLootPickup() {
        for (let i = this.loot.length - 1; i >= 0; i--) {
            const item = this.loot[i];
            const dx = this.x - item.x;
            const dy = this.y - item.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 30) {
                this.addToInventory(item.id, item.count);
                this.loot.splice(i, 1);
                this.stats.itemsCollected++;
            }
        }
    }
    
    addToInventory(itemId, count = 1) {
        const existing = this.inventory.find(i => i.id === itemId);
        if (existing) {
            existing.count += count;
        } else if (this.inventory.length < CONFIG.INVENTORY_SIZE) {
            this.inventory.push({ id: itemId, count });
        }
    }
    
    attack() {
        if (this.attackCooldown > 0) return;
        
        this.isAttacking = true;
        this.attackCooldown = 500;
        
        // 检测攻击范围内的敌人
        for (const enemy of this.enemies) {
            if (enemy.currentHp <= 0) continue;
            
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            // 攻击范围检测
            if (dist < 60) {
                const damage = Math.max(1, this.hunter.atk - enemy.def);
                enemy.currentHp -= damage;
                this.stats.damageDealt += damage;
                
                if (enemy.currentHp <= 0) {
                    this.onEnemyKilled(enemy);
                }
            }
        }
        
        setTimeout(() => {
            this.isAttacking = false;
        }, 200);
    }
    
    onEnemyKilled(enemy) {
        this.stats.kills++;
        
        // 生成掉落
        const enemyData = GameData.enemies[enemy.type];
        if (enemyData.drops && Math.random() < 0.5) {
            const dropId = enemyData.drops[Math.floor(Math.random() * enemyData.drops.length)];
            this.loot.push({
                id: dropId,
                count: 1,
                x: enemy.x,
                y: enemy.y,
            });
        }
        
        // 金币掉落
        if (Math.random() < 0.7) {
            this.loot.push({
                id: 'gold_coin',
                count: 5 + Math.floor(Math.random() * 15),
                x: enemy.x + (Math.random() - 0.5) * 20,
                y: enemy.y + (Math.random() - 0.5) * 20,
            });
        }
        
        // 可能刷新新敌人
        if (this.enemies.filter(e => e.currentHp > 0).length < 3 && Math.random() < 0.5) {
            setTimeout(() => this.spawnEnemy(), 2000);
        }
    }
    
    dash() {
        if (this.dashCooldown > 0 || this.isDashing) return;
        
        this.isDashing = true;
        this.dashCooldown = CONFIG.PLAYER_DASH_COOLDOWN;
        
        const dirX = this.velocityX || 0;
        const dirY = this.velocityY || 0;
        const length = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
        
        const dashDirX = dirX / length;
        const dashDirY = dirY / length;
        
        const dashDistance = CONFIG.PLAYER_DASH_SPEED * CONFIG.PLAYER_DASH_DURATION / 1000;
        this.x += dashDirX * dashDistance;
        this.y += dashDirY * dashDistance;
        
        setTimeout(() => {
            this.isDashing = false;
        }, CONFIG.PLAYER_DASH_DURATION);
    }
    
    useSkill(index) {
        if (this.skillCooldowns[index] > 0) return;
        
        // 简化技能效果
        switch (index) {
            case 0: // Q - 攻击技能
                this.attack();
                this.skillCooldowns[0] = 2000;
                break;
            case 1: // W - 防御/增益
                this.hp = Math.min(this.maxHp, this.hp + 20);
                this.mp -= 10;
                this.skillCooldowns[1] = 5000;
                break;
            case 2: // E - 闪避
                this.dash();
                this.skillCooldowns[2] = 3000;
                break;
            case 3: // R - 大招
                if (this.mp >= 30) {
                    this.mp -= 30;
                    // 范围伤害
                    for (const enemy of this.enemies) {
                        if (enemy.currentHp <= 0) continue;
                        const dx = enemy.x - this.x;
                        const dy = enemy.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 150) {
                            enemy.currentHp -= this.hunter.atk * 2;
                            if (enemy.currentHp <= 0) {
                                this.onEnemyKilled(enemy);
                            }
                        }
                    }
                    this.skillCooldowns[3] = 15000;
                }
                break;
        }
    }
    
    useItem(index) {
        const itemSlots = this.inventory.filter(i => 
            GameData.items[i.id]?.type === 'consumable'
        );
        
        if (index >= itemSlots.length) return;
        
        const slot = itemSlots[index];
        const itemData = GameData.items[slot.id];
        
        if (itemData.effect.hp) {
            this.hp = Math.min(this.maxHp, this.hp + itemData.effect.hp);
        }
        if (itemData.effect.mp) {
            this.mp = Math.min(this.maxMp, this.mp + itemData.effect.mp);
        }
        
        slot.count--;
        if (slot.count <= 0) {
            const idx = this.inventory.indexOf(slot);
            this.inventory.splice(idx, 1);
        }
    }
    
    startEvacuate() {
        if (this.isNearEvacuation && !this.isEvacuating) {
            this.isEvacuating = true;
            this.evacuateProgress = 0;
        }
    }
    
    cancelEvacuate() {
        this.isEvacuating = false;
        this.evacuateProgress = 0;
    }
}

// ==================== 游戏主类 ====================
class Game {
    constructor() {
        this.state = new GameState();
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.lastTime = 0;
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };
        
        this.setupCanvas();
        this.setupEventListeners();
        this.setupUI();
        
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);
    }
    
    setupEventListeners() {
        // 键盘
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyDown(e);
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 鼠标
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.down = true;
            this.handleMouseDown(e);
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.down = false;
        });
    }
    
    handleKeyDown(e) {
        const explore = this.state.exploreState;
        
        if (this.state.currentState === 'explore' && explore) {
            switch (e.key.toLowerCase()) {
                case ' ': // 空格 - 闪避
                    e.preventDefault();
                    explore.dash();
                    break;
                case 'q':
                    explore.useSkill(0);
                    break;
                case 'w':
                    if (e.ctrlKey) return;
                    // W 用于移动,不触发技能
                    break;
                case 'e':
                    explore.useSkill(2);
                    break;
                case 'r':
                    explore.useSkill(3);
                    break;
                case '1':
                    explore.useItem(0);
                    break;
                case '2':
                    explore.useItem(1);
                    break;
                case 'f':
                    explore.startEvacuate();
                    break;
                case 'tab':
                    e.preventDefault();
                    this.toggleInventory();
                    break;
                case 'escape':
                    this.togglePause();
                    break;
            }
        }
    }
    
    handleMouseDown(e) {
        if (this.state.currentState === 'explore' && this.state.exploreState) {
            if (e.button === 0) { // 左键攻击
                this.state.exploreState.attack();
            }
        }
    }
    
    setupUI() {
        // 启动按钮
        document.getElementById('btn-start').addEventListener('click', () => {
            this.changeState('guild');
        });
        
        // 出击准备按钮
        document.getElementById('btn-prepare').addEventListener('click', () => {
            this.changeState('prep');
        });
        
        // 返回公会
        document.getElementById('btn-back-guild').addEventListener('click', () => {
            this.state.prepStep = 0;
            this.state.selectedHunter = null;
            this.state.selectedArea = null;
            this.changeState('guild');
        });
        
        // 准备步骤导航
        document.getElementById('btn-prep-prev').addEventListener('click', () => {
            this.prevPrepStep();
        });
        
        document.getElementById('btn-prep-next').addEventListener('click', () => {
            this.nextPrepStep();
        });
        
        // 暂停菜单
        document.getElementById('btn-resume').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('btn-quit-explore').addEventListener('click', () => {
            this.quitExplore();
        });
        
        // 背包关闭
        document.getElementById('btn-close-inventory').addEventListener('click', () => {
            this.toggleInventory();
        });
        
        // 商店
        document.querySelector('[data-facility="shop"]').addEventListener('click', () => {
            this.openShop();
        });
        
        document.getElementById('btn-close-shop').addEventListener('click', () => {
            document.getElementById('shop-modal').classList.add('hidden');
        });
    }
    
    changeState(newState) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        this.state.currentState = newState;
        
        switch (newState) {
            case 'boot':
                document.getElementById('boot-screen').classList.add('active');
                break;
                
            case 'guild':
                document.getElementById('guild-screen').classList.add('active');
                this.updateGuildUI();
                break;
                
            case 'prep':
                document.getElementById('prep-screen').classList.add('active');
                this.state.prepStep = 0;
                this.updatePrepUI();
                break;
                
            case 'loading':
                document.getElementById('loading-screen').classList.add('active');
                this.startLoading();
                break;
                
            case 'explore':
                document.getElementById('explore-hud').classList.add('active');
                break;
                
            case 'settle':
                document.getElementById('settle-screen').classList.add('active');
                break;
        }
    }
    
    updateGuildUI() {
        // 更新资源显示
        document.getElementById('gold-amount').textContent = this.state.gold;
        document.getElementById('soul-amount').textContent = this.state.souls;
        
        // 更新猎手列表
        const hunterList = document.getElementById('hunter-list');
        hunterList.innerHTML = '';
        
        for (const hunter of this.state.hunters) {
            const classData = GameData.classes[hunter.class];
            const card = document.createElement('div');
            card.className = `hunter-card ${hunter.status}`;
            card.innerHTML = `
                <div class="hunter-avatar">${classData.icon}</div>
                <div class="hunter-name">${hunter.name}</div>
                <div class="hunter-class">${classData.name}</div>
                <div class="hunter-level">Lv.${hunter.level}</div>
                <div class="hunter-status ${hunter.status}">
                    ${hunter.status === 'healthy' ? '健康' : hunter.status === 'injured' ? '受伤' : '死亡'}
                </div>
            `;
            hunterList.appendChild(card);
        }
    }
    
    updatePrepUI() {
        // 隐藏所有步骤
        document.querySelectorAll('.prep-step').forEach(s => s.classList.remove('active'));
        
        // 显示当前步骤
        const steps = ['prep-step-hunter', 'prep-step-area', 'prep-step-confirm'];
        document.getElementById(steps[this.state.prepStep]).classList.add('active');
        
        // 更新按钮状态
        const prevBtn = document.getElementById('btn-prep-prev');
        const nextBtn = document.getElementById('btn-prep-next');
        
        prevBtn.disabled = this.state.prepStep === 0;
        nextBtn.textContent = this.state.prepStep === 2 ? '确认出击' : '下一步';
        
        // 更新步骤内容
        if (this.state.prepStep === 0) {
            this.updateHunterSelectUI();
        } else if (this.state.prepStep === 1) {
            this.updateAreaSelectUI();
        } else if (this.state.prepStep === 2) {
            this.updateConfirmUI();
        }
    }
    
    updateHunterSelectUI() {
        const list = document.getElementById('prep-hunter-list');
        list.innerHTML = '';
        
        for (const hunter of this.state.hunters) {
            const classData = GameData.classes[hunter.class];
            const isSelectable = hunter.status === 'healthy';
            const isSelected = this.state.selectedHunter?.id === hunter.id;
            
            const card = document.createElement('div');
            card.className = `hunter-card ${hunter.status} ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="hunter-avatar">${classData.icon}</div>
                <div class="hunter-name">${hunter.name}</div>
                <div class="hunter-class">${classData.name}</div>
                <div class="hunter-level">Lv.${hunter.level}</div>
                <div class="hunter-status ${hunter.status}">
                    ${hunter.status === 'healthy' ? '可出击' : hunter.status === 'injured' ? '受伤中' : '已死亡'}
                </div>
            `;
            
            if (isSelectable) {
                card.addEventListener('click', () => {
                    this.state.selectedHunter = hunter;
                    this.updatePrepUI();
                });
            }
            
            list.appendChild(card);
        }
    }
    
    updateAreaSelectUI() {
        const list = document.getElementById('area-list');
        list.innerHTML = '';
        
        for (const [areaId, area] of Object.entries(GameData.areas)) {
            const isLocked = area.locked;
            const isSelected = this.state.selectedArea === areaId;
            
            const card = document.createElement('div');
            card.className = `area-card ${isLocked ? 'locked' : ''} ${isSelected ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="area-icon">${area.icon}</div>
                <div class="area-name">${area.name}</div>
                <div class="area-difficulty">难度：${'★'.repeat(area.difficulty)}${'☆'.repeat(3 - area.difficulty)}</div>
                <div class="area-level">推荐等级：Lv.${area.levelReq}+</div>
                ${isLocked ? '<div class="area-locked">🔒 未解锁</div>' : ''}
            `;
            
            if (!isLocked) {
                card.addEventListener('click', () => {
                    this.state.selectedArea = areaId;
                    this.updatePrepUI();
                });
            }
            
            list.appendChild(card);
        }
    }
    
    updateConfirmUI() {
        if (this.state.selectedHunter && this.state.selectedArea) {
            const classData = GameData.classes[this.state.selectedHunter.class];
            const areaData = GameData.areas[this.state.selectedArea];
            
            document.getElementById('confirm-hunter').textContent = 
                `${this.state.selectedHunter.name} (${classData.name}) Lv.${this.state.selectedHunter.level}`;
            document.getElementById('confirm-area').textContent = areaData.name;
        }
    }
    
    prevPrepStep() {
        if (this.state.prepStep > 0) {
            this.state.prepStep--;
            this.updatePrepUI();
        }
    }
    
    nextPrepStep() {
        if (this.state.prepStep === 0) {
            if (!this.state.selectedHunter) {
                this.showMessage('请选择一名猎手', 'warning');
                return;
            }
            this.state.prepStep++;
        } else if (this.state.prepStep === 1) {
            if (!this.state.selectedArea) {
                this.showMessage('请选择探索区域', 'warning');
                return;
            }
            this.state.prepStep++;
        } else if (this.state.prepStep === 2) {
            // 开始探索
            this.changeState('loading');
        }
        this.updatePrepUI();
    }
    
    startLoading() {
        const areaData = GameData.areas[this.state.selectedArea];
        document.getElementById('loading-area-name').textContent = `正在进入 ${areaData.name}...`;
        
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        const interval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // 创建探索状态
                this.state.exploreState = new ExploreState(
                    this.state.selectedHunter,
                    this.state.selectedArea
                );
                
                setTimeout(() => {
                    this.changeState('explore');
                }, 300);
            }
            progressBar.style.width = progress + '%';
        }, 100);
    }
    
    toggleInventory() {
        const modal = document.getElementById('inventory-modal');
        modal.classList.toggle('hidden');
        
        if (!modal.classList.contains('hidden')) {
            this.updateInventoryUI();
            if (this.state.exploreState) {
                this.state.exploreState.isPaused = true;
            }
        } else {
            if (this.state.exploreState) {
                this.state.exploreState.isPaused = false;
            }
        }
    }
    
    updateInventoryUI() {
        const grid = document.getElementById('inventory-grid');
        grid.innerHTML = '';
        
        const inventory = this.state.exploreState?.inventory || [];
        
        for (let i = 0; i < CONFIG.INVENTORY_SIZE; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            
            if (i < inventory.length) {
                const item = inventory[i];
                const itemData = GameData.items[item.id];
                slot.classList.add('has-item');
                slot.innerHTML = `
                    <div class="item-icon">${itemData.icon}</div>
                    <div class="item-name">${itemData.name}</div>
                    <div class="item-count">x${item.count}</div>
                `;
            }
            
            grid.appendChild(slot);
        }
        
        document.getElementById('inventory-count').textContent = inventory.length;
    }
    
    togglePause() {
        const modal = document.getElementById('pause-modal');
        modal.classList.toggle('hidden');
        
        if (this.state.exploreState) {
            this.state.exploreState.isPaused = !modal.classList.contains('hidden');
        }
    }
    
    quitExplore() {
        document.getElementById('pause-modal').classList.add('hidden');
        this.endExplore('quit');
    }
    
    endExplore(result) {
        const explore = this.state.exploreState;
        
        // 计算结果
        let totalGold = 0;
        let totalExp = 0;
        const collectedItems = [];
        
        if (result === 'evacuated') {
            // 成功撤离 - 保留所有物品
            for (const item of explore.inventory) {
                if (item.id === 'gold_coin') {
                    totalGold += item.count;
                } else {
                    collectedItems.push({ ...item });
                }
            }
            totalExp = explore.stats.kills * 10 + explore.stats.eliteKills * 30;
            
            // 更新玩家数据
            this.state.gold += totalGold;
            
            // 猎手获得经验
            const hunter = this.state.hunters.find(h => h.id === this.state.selectedHunter.id);
            if (hunter) {
                hunter.exp += totalExp;
                while (hunter.exp >= hunter.expToNext) {
                    hunter.exp -= hunter.expToNext;
                    hunter.level++;
                    hunter.expToNext = hunter.level * 100;
                    hunter.maxHp += 10;
                    hunter.maxMp += 5;
                    hunter.currentHp = hunter.maxHp;
                    hunter.currentMp = hunter.maxMp;
                    hunter.atk += 2;
                    hunter.def += 1;
                }
                // 恢复生命值(部分)
                hunter.currentHp = Math.min(hunter.maxHp, explore.hp);
            }
            
            // 物品存入仓库
            for (const item of collectedItems) {
                const existing = this.state.storage.find(s => s.id === item.id);
                if (existing) {
                    existing.count += item.count;
                } else {
                    this.state.storage.push({ ...item });
                }
            }
        } else {
            // 死亡或放弃 - 失去所有物品
            const hunter = this.state.hunters.find(h => h.id === this.state.selectedHunter.id);
            if (hunter) {
                if (result === 'dead') {
                    hunter.status = 'dead';
                    totalExp = Math.floor(explore.stats.kills * 3); // 少量经验
                    hunter.exp += totalExp;
                }
            }
        }
        
        // 显示结算界面
        this.showSettleScreen(result, {
            kills: explore.stats.kills,
            time: explore.stats.time,
            gold: totalGold,
            exp: totalExp,
            items: collectedItems,
            damageDealt: explore.stats.damageDealt,
            damageTaken: explore.stats.damageTaken,
        });
        
        this.state.exploreState = null;
        this.changeState('settle');
    }
    
    showSettleScreen(result, stats) {
        const content = document.getElementById('settle-content');
        const isSuccess = result === 'evacuated';
        
        content.innerHTML = `
            <div class="${isSuccess ? 'settle-success' : 'settle-fail'}">
                <h1>${isSuccess ? '✓ 撤离成功！' : '✗ 探索失败'}</h1>
            </div>
            <div class="settle-stats">
                <p>探索时间 <span>${Math.floor(stats.time / 60)}:${(stats.time % 60).toString().padStart(2, '0')}</span></p>
                <p>击杀数 <span>${stats.kills}</span></p>
                <p>造成伤害 <span>${stats.damageDealt}</span></p>
                <p>受到伤害 <span>${stats.damageTaken}</span></p>
            </div>
            ${isSuccess ? `
                <div class="settle-items">
                    <h3>获得物品</h3>
                    <div class="settle-item-grid">
                        ${stats.items.map(item => {
                            const data = GameData.items[item.id];
                            return `
                                <div class="settle-item">
                                    <div class="item-icon">${data.icon}</div>
                                    <div class="item-count">x${item.count}</div>
                                </div>
                            `;
                        }).join('')}
                        <div class="settle-item">
                            <div class="item-icon">💰</div>
                            <div class="item-count">${stats.gold}</div>
                        </div>
                    </div>
                </div>
            ` : ''}
            <div class="settle-exp">
                <p>获得经验 <span class="exp-value">+${stats.exp} EXP</span></p>
            </div>
            <button class="btn btn-primary" onclick="game.returnToGuild()">返回公会</button>
        `;
    }
    
    returnToGuild() {
        this.state.selectedHunter = null;
        this.state.selectedArea = null;
        this.state.prepStep = 0;
        this.changeState('guild');
    }
    
    openShop() {
        const modal = document.getElementById('shop-modal');
        modal.classList.remove('hidden');
        
        const shopItems = document.getElementById('shop-items');
        shopItems.innerHTML = '';
        
        for (const itemId of GameData.shopItems) {
            const itemData = GameData.items[itemId];
            const div = document.createElement('div');
            div.className = 'shop-item';
            div.innerHTML = `
                <div class="shop-item-icon">${itemData.icon}</div>
                <div class="shop-item-info">
                    <div class="shop-item-name">${itemData.name}</div>
                    <div class="shop-item-desc">${itemData.effect.hp ? `恢复${itemData.effect.hp}HP` : `恢复${itemData.effect.mp}MP`}</div>
                </div>
                <div class="shop-item-price">💰 ${itemData.price}</div>
            `;
            
            div.addEventListener('click', () => {
                this.buyItem(itemId);
            });
            
            shopItems.appendChild(div);
        }
    }
    
    buyItem(itemId) {
        const itemData = GameData.items[itemId];
        
        if (this.state.gold < itemData.price) {
            this.showMessage('金币不足', 'error');
            return;
        }
        
        this.state.gold -= itemData.price;
        
        const existing = this.state.storage.find(s => s.id === itemId);
        if (existing) {
            existing.count++;
        } else {
            this.state.storage.push({ id: itemId, count: 1 });
        }
        
        this.showMessage(`购买了 ${itemData.name}`, 'success');
        this.updateGuildUI();
    }
    
    showMessage(text, type = 'info') {
        const container = document.getElementById('message-container');
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.textContent = text;
        container.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 3000);
    }
    
    // ==================== 游戏循环 ====================
    gameLoop(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
    
    update(deltaTime) {
        if (this.state.currentState === 'explore' && this.state.exploreState) {
            const explore = this.state.exploreState;
            
            if (!explore.isPaused) {
                // 处理输入
                let moveX = 0, moveY = 0;
                if (this.keys['w'] || this.keys['arrowup']) moveY = -1;
                if (this.keys['s'] || this.keys['arrowdown']) moveY = 1;
                if (this.keys['a'] || this.keys['arrowleft']) moveX = -1;
                if (this.keys['d'] || this.keys['arrowright']) moveX = 1;
                
                // 归一化
                const length = Math.sqrt(moveX * moveX + moveY * moveY);
                if (length > 0) {
                    moveX /= length;
                    moveY /= length;
                    explore.facing = moveX > 0 ? 'right' : 'left';
                }
                
                explore.velocityX = moveX * CONFIG.PLAYER_SPEED;
                explore.velocityY = moveY * CONFIG.PLAYER_SPEED;
                
                // 受击中断撤离
                if (explore.isEvacuating) {
                    // 检查是否被攻击
                    for (const enemy of explore.enemies) {
                        if (enemy.currentHp <= 0) continue;
                        const dx = explore.x - enemy.x;
                        const dy = explore.y - enemy.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 40) {
                            explore.cancelEvacuate();
                            break;
                        }
                    }
                }
                
                // 更新探索状态
                const result = explore.update(deltaTime);
                
                if (result === 'dead') {
                    this.endExplore('dead');
                } else if (result === 'evacuated') {
                    this.endExplore('evacuated');
                }
                
                // 更新HUD
                this.updateExploreHUD();
            }
        }
    }
    
    updateExploreHUD() {
        const explore = this.state.exploreState;
        if (!explore) return;
        
        // HP
        const hpPercent = (explore.hp / explore.maxHp) * 100;
        document.getElementById('hp-bar-fill').style.width = hpPercent + '%';
        document.getElementById('hp-text').textContent = `${Math.floor(explore.hp)}/${explore.maxHp}`;
        
        // MP
        const mpPercent = (explore.mp / explore.maxMp) * 100;
        document.getElementById('mp-bar-fill').style.width = mpPercent + '%';
        document.getElementById('mp-text').textContent = `${Math.floor(explore.mp)}/${explore.maxMp}`;
        
        // 侵蚀度
        document.getElementById('corrosion-bar-fill').style.width = explore.corrosion + '%';
        document.getElementById('corrosion-text').textContent = Math.floor(explore.corrosion) + '%';
        
        // 撤离提示
        const evacuatePrompt = document.getElementById('evacuate-prompt');
        const evacuateProgress = document.getElementById('evacuate-progress');
        
        if (explore.isEvacuating) {
            evacuatePrompt.classList.add('hidden');
            evacuateProgress.classList.remove('hidden');
            const progress = (explore.evacuateProgress / CONFIG.EVACUATE_TIME) * 100;
            document.getElementById('evacuate-bar-fill').style.width = progress + '%';
            const remaining = ((CONFIG.EVACUATE_TIME - explore.evacuateProgress) / 1000).toFixed(1);
            document.getElementById('evacuate-time').textContent = remaining + 's';
        } else if (explore.isNearEvacuation) {
            evacuatePrompt.classList.remove('hidden');
            evacuateProgress.classList.add('hidden');
        } else {
            evacuatePrompt.classList.add('hidden');
            evacuateProgress.classList.add('hidden');
        }
        
        // 物品数量
        const potions = explore.inventory.filter(i => i.id === 'health_potion')[0];
        const manaPotions = explore.inventory.filter(i => i.id === 'mana_potion')[0];
        document.getElementById('item-1-count').textContent = potions?.count || 0;
        document.getElementById('item-2-count').textContent = manaPotions?.count || 0;
    }
    
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state.currentState === 'explore' && this.state.exploreState) {
            this.renderExplore();
        }
    }
    
    renderExplore() {
        const ctx = this.ctx;
        const explore = this.state.exploreState;
        const areaData = explore.areaData;
        
        // 计算画布居中偏移
        const offsetX = (this.canvas.width - 800) / 2;
        const offsetY = (this.canvas.height - 600) / 2;
        
        ctx.save();
        ctx.translate(offsetX, offsetY);
        
        // 绘制背景
        ctx.fillStyle = areaData.color;
        ctx.fillRect(0, 0, 800, 600);
        
        // 绘制网格
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let x = 0; x < 800; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 600);
            ctx.stroke();
        }
        for (let y = 0; y < 600; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(800, y);
            ctx.stroke();
        }
        
        // 绘制撤离点
        for (const point of explore.evacuationPoints) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
            ctx.fill();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // 撤离点图标
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#22c55e';
            ctx.fillText('🚪', point.x, point.y + 8);
        }
        
        // 绘制掉落物
        for (const loot of explore.loot) {
            const itemData = GameData.items[loot.id];
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(itemData.icon, loot.x, loot.y);
        }
        
        // 绘制敌人
        for (const enemy of explore.enemies) {
            if (enemy.currentHp <= 0) continue;
            
            // 敌人图标
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(enemy.icon, enemy.x, enemy.y + 10);
            
            // 血条
            const hpPercent = enemy.currentHp / enemy.hp;
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(enemy.x - 20, enemy.y - 25, 40, 6);
            ctx.fillStyle = hpPercent > 0.3 ? '#22c55e' : '#ef4444';
            ctx.fillRect(enemy.x - 20, enemy.y - 25, 40 * hpPercent, 6);
            
            // 状态指示
            if (enemy.state === 'chase') {
                ctx.fillStyle = '#ef4444';
                ctx.fillText('!', enemy.x, enemy.y - 30);
            } else if (enemy.state === 'alert') {
                ctx.fillStyle = '#f59e0b';
                ctx.fillText('?', enemy.x, enemy.y - 30);
            }
        }
        
        // 绘制玩家
        const classData = GameData.classes[explore.hunter.class];
        
        // 闪避效果
        if (explore.isDashing) {
            ctx.globalAlpha = 0.5;
        }
        
        // 攻击效果
        if (explore.isAttacking) {
            ctx.beginPath();
            ctx.arc(explore.x, explore.y, 60, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
            ctx.fill();
        }
        
        // 玩家图标
        ctx.font = '36px Arial';
        ctx.textAlign = 'center';
        ctx.globalAlpha = 1;
        ctx.fillText(classData.icon, explore.x, explore.y + 12);
        
        // 玩家名字
        ctx.font = '12px Arial';
        ctx.fillStyle = '#fff';
        ctx.fillText(explore.hunter.name, explore.x, explore.y - 25);
        
        // 侵蚀效果
        if (explore.corrosion > 50) {
            ctx.fillStyle = `rgba(139, 92, 246, ${(explore.corrosion - 50) / 100 * 0.3})`;
            ctx.fillRect(0, 0, 800, 600);
        }
        
        ctx.restore();
        
        // 绘制小地图
        this.renderMinimap();
    }
    
    renderMinimap() {
        const explore = this.state.exploreState;
        if (!explore) return;
        
        const canvas = document.getElementById('minimap-canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = 150;
        canvas.height = 150;
        
        const scale = 150 / 800;
        
        // 背景
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 150, 150);
        
        // 撤离点
        for (const point of explore.evacuationPoints) {
            ctx.beginPath();
            ctx.arc(point.x * scale, point.y * scale * (600/800), 5, 0, Math.PI * 2);
            ctx.fillStyle = '#22c55e';
            ctx.fill();
        }
        
        // 敌人
        for (const enemy of explore.enemies) {
            if (enemy.currentHp <= 0) continue;
            ctx.beginPath();
            ctx.arc(enemy.x * scale, enemy.y * scale * (600/800), 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();
        }
        
        // 玩家
        ctx.beginPath();
        ctx.arc(explore.x * scale, explore.y * scale * (600/800), 4, 0, Math.PI * 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fill();
    }
}

// ==================== 启动游戏 ====================
const game = new Game();
