/**
 * Story data: chapters, dialogues, choices
 */

class StoryData {
    constructor() {
        this.chapters = {};
        this.loadChapters();
    }

    /**
     * Loads chapter data
     */
    loadChapters() {
        // Currently using embedded data
        // In the future can load from JSON files
        this.chapters = {
            chapter1: this.getChapter1()
        };
    }

    /**
     * Gets chapter data
     */
    getChapter(chapterId) {
        return this.chapters[chapterId] || null;
    }

    /**
     * Gets scene from chapter
     */
    getScene(chapterId, sceneId) {
        const chapter = this.getChapter(chapterId);
        if (!chapter) return null;
        
        return chapter.scenes.find(s => s.sceneId === sceneId) || null;
    }

    /**
     * Chapter 1: First Wave
     */
    getChapter1() {
        return {
            chapterId: "chapter1",
            title: "First Wave",
            description: "The hero enters a luxurious casino to complete their first mission",
            scenes: [
                {
                    sceneId: "intro",
                    background: "casino_lobby",
                    characters: [
                        { name: "hero", position: "center", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Night. Neon lights reflect on the wet asphalt." },
                        { speaker: "narrator", text: "You stand before the entrance to the most luxurious casino in the city - 'Lucky Wave'." },
                        { speaker: "hero", text: "This is my chance. My first big mission." },
                        { speaker: "narrator", text: "You adjust your tie and take a deep breath." },
                        { speaker: "hero", text: "Time to catch the wave of luck..." }
                    ],
                    choices: [
                        { 
                            text: "Enter the casino", 
                            nextScene: "inside",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "inside",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "left", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Inside the casino, an atmosphere of luxury and excitement reigns." },
                        { speaker: "narrator", text: "Golden chandeliers illuminate the gaming tables, and the sounds of slots mix with quiet laughter." },
                        { speaker: "hero", text: "Need to find the bartender. He must know where the target is." },
                        { speaker: "narrator", text: "You scan the hall, looking for the bar counter." }
                    ],
                    choices: [
                        { 
                            text: "Approach the bar", 
                            nextScene: "bar",
                            required: null
                        },
                        { 
                            text: "Head to the gaming tables", 
                            nextScene: "tables",
                            required: null
                        },
                        { 
                            text: "Check the VIP area", 
                            nextScene: "vip",
                            required: "key",
                            premium: true
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" },
                        { name: "bartender", position: "right", emotion: "neutral" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You approach the bar counter. The bartender is a middle-aged man with a penetrating gaze." },
                        { speaker: "bartender", text: "What will you drink?" },
                        { speaker: "hero", text: "Whiskey. Double." },
                        { speaker: "bartender", text: "Good choice. But first - a little game?" },
                        { speaker: "narrator", text: "The bartender points to a card table." },
                        { speaker: "bartender", text: "Beat me at blackjack - I'll tell you what interests you." }
                    ],
                    choices: [
                        { 
                            text: "Agree to play", 
                            nextScene: "bar_blackjack",
                            required: null
                        },
                        { 
                            text: "Try to negotiate", 
                            nextScene: "bar_negotiate",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_blackjack",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "focused" },
                        { name: "bartender", position: "right", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You sit at the table. The bartender shuffles the deck." },
                        { speaker: "bartender", text: "Rules are simple: 21 or closer. Shall we begin?" }
                    ],
                    choices: [],
                    minigame: "blackjack",
                    onMinigameComplete: {
                        win: {
                            sceneId: "bar_win",
                            dialogues: [
                                { speaker: "bartender", text: "Well played! You've earned the information." },
                                { speaker: "bartender", text: "Your target is in the VIP room. But it's not easy to get there..." }
                            ]
                        },
                        lose: {
                            sceneId: "bar_lose",
                            dialogues: [
                                { speaker: "bartender", text: "Bad luck. Maybe next time?" },
                                { speaker: "narrator", text: "The bartender leaves, leaving you without information." }
                            ]
                        },
                        draw: {
                            sceneId: "bar_draw",
                            dialogues: [
                                { speaker: "bartender", text: "Draw. But for persistence - a small hint: look in the slots." }
                            ]
                        }
                    }
                },
                {
                    sceneId: "bar_negotiate",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" },
                        { name: "bartender", position: "right", emotion: "neutral" }
                    ],
                    dialogues: [
                        { speaker: "hero", text: "Maybe we can make a different deal?" },
                        { speaker: "bartender", text: "Hmm... You're persistent. I like that." },
                        { speaker: "bartender", text: "Alright, I'll give you the information, but in return you'll have to help me in the future." },
                        { speaker: "hero", text: "Fair. What do you know?" },
                        { speaker: "bartender", text: "Your target is in the VIP room. But you need a special pass to get there." },
                        { speaker: "bartender", text: "You can get it by winning a poker tournament or... finding another way." },
                        { speaker: "hero", text: "Thanks. I'll remember that." },
                        { speaker: "bartender", text: "I hope so. Good luck." }
                    ],
                    choices: [
                        { 
                            text: "Head to the poker table", 
                            nextScene: "poker_tournament",
                            required: null
                        },
                        { 
                            text: "Try to find another way", 
                            nextScene: "tables",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_win",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "satisfied" },
                        { name: "bartender", position: "right", emotion: "impressed" }
                    ],
                    dialogues: [
                        { speaker: "bartender", text: "Your target is in the VIP room on the second floor." },
                        { speaker: "bartender", text: "But you need a special pass to get there. You can get it by winning a poker tournament." },
                        { speaker: "hero", text: "Thanks for the information." },
                        { speaker: "bartender", text: "Good luck. You'll need it." }
                    ],
                    choices: [
                        { 
                            text: "Head to the poker table", 
                            nextScene: "poker_tournament",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "tables",
                    background: "casino_tables",
                    characters: [
                        { name: "hero", position: "center", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You approach the gaming tables. Excitement is in the air." },
                        { speaker: "narrator", text: "One of the slot machines catches your attention - it looks unusual." },
                        { speaker: "hero", text: "This could be a way to access the system..." }
                    ],
                    choices: [
                        { 
                            text: "Approach the slot machine", 
                            nextScene: "slots_hack",
                            required: null
                        },
                        { 
                            text: "Return to the bar", 
                            nextScene: "bar",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "slots_hack",
                    background: "casino_tables",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You approach the slot machine. A message about a special combination flashes on the screen." },
                        { speaker: "hero", text: "If I can get the right combination, I can access the security system..." }
                    ],
                    choices: [],
                    minigame: "slots",
                    onMinigameComplete: {
                        jackpot: {
                            sceneId: "slots_success",
                            dialogues: [
                                { speaker: "narrator", text: "JACKPOT! System hacked!" },
                                { speaker: "hero", text: "Excellent! Now I have access to the VIP area." }
                            ]
                        },
                        win: {
                            sceneId: "slots_partial",
                            dialogues: [
                                { speaker: "narrator", text: "Good combination, but not perfect. System partially opened." },
                                { speaker: "hero", text: "This should be enough..." }
                            ]
                        },
                        lose: {
                            sceneId: "slots_fail",
                            dialogues: [
                                { speaker: "narrator", text: "Failed to hack the system. Need to try another way." }
                            ]
                        },
                        partial: {
                            sceneId: "slots_partial",
                            dialogues: [
                                { speaker: "narrator", text: "Almost got it. Try again." }
                            ]
                        }
                    }
                },
                {
                    sceneId: "poker_tournament",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "determined" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You find a poker tournament. The prize - a VIP pass." },
                        { speaker: "narrator", text: "This is your chance to get what you need." }
                    ],
                    choices: [],
                    minigame: "poker",
                    onMinigameComplete: {
                        win: {
                            sceneId: "poker_win",
                            dialogues: [
                                { speaker: "narrator", text: "You won the tournament! The VIP pass is yours." },
                                { speaker: "hero", text: "Now I can get where I need to go." }
                            ]
                        },
                        lose: {
                            sceneId: "poker_lose",
                            dialogues: [
                                { speaker: "narrator", text: "Tournament lost. Need to find another way." }
                            ]
                        }
                    }
                },
                {
                    sceneId: "vip",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "VIP-зона. Здесь играют только самые важные гости." },
                        { speaker: "narrator", text: "You see your target - she is sitting at a table in the far corner." },
                        { speaker: "hero", text: "There she is. My mission is almost complete..." }
                    ],
                    choices: [
                        { 
                            text: "Approach the target", 
                            nextScene: "finale",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "slots_success",
                    background: "casino_tables",
                    characters: [
                        { name: "hero", position: "center", emotion: "satisfied" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Security system disabled. Now you can access the VIP area." },
                        { speaker: "hero", text: "Excellent! Now I need to find a way to get there unnoticed." }
                    ],
                    choices: [
                        { 
                            text: "Head to the VIP area", 
                            nextScene: "vip_entrance",
                            required: null
                        },
                        { 
                            text: "Return to the bartender for information", 
                            nextScene: "bar_info",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "slots_partial",
                    background: "casino_tables",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "System partially opened. Need to try again or find another way." },
                        { speaker: "hero", text: "Maybe I should try again?" }
                    ],
                    choices: [
                        { 
                            text: "Try again", 
                            nextScene: "slots_hack",
                            required: null
                        },
                        { 
                            text: "Find another way", 
                            nextScene: "bar",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "slots_fail",
                    background: "casino_tables",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "System not hacked. Guards may notice your attempts." },
                        { speaker: "hero", text: "Нужно быть осторожнее. Попробую другой подход." }
                    ],
                    choices: [
                        { 
                            text: "Return to the bartender", 
                            nextScene: "bar",
                            required: null
                        },
                        { 
                            text: "Try the poker tournament", 
                            nextScene: "poker_tournament",
                            required: "key"
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_win",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "satisfied" },
                        { name: "bartender", position: "right", emotion: "impressed" }
                    ],
                    dialogues: [
                        { speaker: "bartender", text: "Ваша цель находится в VIP-зале на втором этаже." },
                        { speaker: "bartender", text: "Но туда нужен специальный пропуск. Его можно получить, выиграв турнир по покеру." },
                        { speaker: "hero", text: "Спасибо за информацию." },
                        { speaker: "bartender", text: "Удачи. Вам понадобится." }
                    ],
                    choices: [
                        { 
                            text: "Head to the poker table", 
                            nextScene: "poker_tournament",
                            required: null
                        },
                        { 
                            text: "Try hacking the system through slots", 
                            nextScene: "slots_hack",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_lose",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "cautious" },
                        { name: "bartender", position: "right", emotion: "neutral" }
                    ],
                    dialogues: [
                        { speaker: "bartender", text: "Не повезло. Может, в другой раз?" },
                        { speaker: "narrator", text: "Бармен уходит, оставляя вас без информации." },
                        { speaker: "hero", text: "Нужно найти другой способ получить информацию." }
                    ],
                    choices: [
                        { 
                            text: "Try playing with the bartender again", 
                            nextScene: "bar_blackjack",
                            required: null
                        },
                        { 
                            text: "Try hacking the system", 
                            nextScene: "slots_hack",
                            required: null
                        },
                        { 
                            text: "Try to negotiate", 
                            nextScene: "bar_negotiate",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_draw",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "focused" },
                        { name: "bartender", position: "right", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "bartender", text: "Ничья. Но за упорство - небольшая подсказка: ищите в слотах." },
                        { speaker: "hero", text: "Спасибо. Это поможет." }
                    ],
                    choices: [
                        { 
                            text: "Head to the slot machines", 
                            nextScene: "slots_hack",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "bar_info",
                    background: "casino_bar",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" },
                        { name: "bartender", position: "right", emotion: "neutral" }
                    ],
                    dialogues: [
                        { speaker: "bartender", text: "Вы снова здесь. Что-то еще нужно?" },
                        { speaker: "hero", text: "Maybe you know something else about the VIP area?" },
                        { speaker: "bartender", text: "Там строгая охрана. Без пропуска не пройти." },
                        { speaker: "bartender", text: "But if you have connections... or money..." },
                        { speaker: "hero", text: "I see. Thanks." }
                    ],
                    choices: [
                        { 
                            text: "Try to bribe the guards", 
                            nextScene: "vip_bribe",
                            required: "ticket"
                        },
                        { 
                            text: "Get a pass through the tournament", 
                            nextScene: "poker_tournament",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "poker_win",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "triumphant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы выиграли турнир! Пропуск в VIP-зону ваш." },
                        { speaker: "narrator", text: "The organizer hands you a golden pass." },
                        { speaker: "hero", text: "Now I can get where I need to go." }
                    ],
                    choices: [
                        { 
                            text: "Head to the VIP area", 
                            nextScene: "vip_entrance",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "poker_lose",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Турнир проигран. Нужно найти другой способ." },
                        { speaker: "hero", text: "Не повезло. Но я не сдаюсь." }
                    ],
                    choices: [
                        { 
                            text: "Try hacking the system", 
                            nextScene: "slots_hack",
                            required: null
                        },
                        { 
                            text: "Return to the bartender", 
                            nextScene: "bar",
                            required: null
                        },
                        { 
                            text: "Try to bribe the guards", 
                            nextScene: "vip_bribe",
                            required: "ticket"
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_entrance",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы подходите к входу в VIP-зону. Охранник проверяет ваш пропуск." },
                        { speaker: "narrator", text: "Пропуск действителен. Охранник пропускает вас." },
                        { speaker: "hero", text: "Отлично. Теперь нужно найти цель." }
                    ],
                    choices: [
                        { 
                            text: "Enter the VIP area", 
                            nextScene: "vip",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_bribe",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы подходите к охраннику с предложением." },
                        { speaker: "narrator", text: "Охранник колеблется, но принимает ваше предложение." },
                        { speaker: "hero", text: "Деньги решают многое в этом мире." }
                    ],
                    choices: [
                        { 
                            text: "Enter the VIP area", 
                            nextScene: "vip",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "VIP-зона. Здесь играют только самые важные гости." },
                        { speaker: "narrator", text: "Роскошь здесь на каждом шагу. Золотые люстры, бархатные ковры, дорогие напитки." },
                        { speaker: "narrator", text: "Вы осматриваете зал и видите свою цель - она сидит за столом в дальнем углу." },
                        { speaker: "hero", text: "There she is. My mission is almost complete..." },
                        { speaker: "narrator", text: "Но вокруг нее несколько охранников. Нужно быть осторожным." }
                    ],
                    choices: [
                        { 
                            text: "Approach directly", 
                            nextScene: "vip_direct",
                            required: null
                        },
                        { 
                            text: "Wait for the right moment", 
                            nextScene: "vip_wait",
                            required: null
                        },
                        { 
                            text: "Try to distract the guards", 
                            nextScene: "vip_distract",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_direct",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы подходите напрямую к цели. Охранники насторожились." },
                        { speaker: "narrator", text: "Но ваша уверенность и пропуск делают свое дело - они пропускают вас." },
                        { speaker: "hero", text: "Иногда лучшая тактика - это прямота." }
                    ],
                    choices: [
                        { 
                            text: "Continue", 
                            nextScene: "vip_confrontation",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_wait",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы ждете подходящего момента. Время тянется медленно." },
                        { speaker: "narrator", text: "Наконец, цель встает и направляется к выходу. Охранники следуют за ней." },
                        { speaker: "hero", text: "Идеальный момент. Теперь я могу подойти незамеченным." }
                    ],
                    choices: [
                        { 
                            text: "Follow the target", 
                            nextScene: "vip_follow",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_distract",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы создаете небольшое происшествие - роняете бокал, привлекая внимание охранников." },
                        { speaker: "narrator", text: "While they deal with the situation, you quietly approach the target." },
                        { speaker: "hero", text: "Cunning is sometimes better than force." }
                    ],
                    choices: [
                        { 
                            text: "Approach the target", 
                            nextScene: "vip_confrontation",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_follow",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You follow the target through the VIP area corridors." },
                        { speaker: "narrator", text: "She enters a separate room. Guards stay outside." },
                        { speaker: "hero", text: "Perfect opportunity. Now we can talk alone." }
                    ],
                    choices: [
                        { 
                            text: "Enter the room", 
                            nextScene: "vip_confrontation",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_confrontation",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You are face to face with your mission target." },
                        { speaker: "narrator", text: "She looks at you with surprise but without fear." },
                        { speaker: "target", text: "I knew you would come. The question was only when." },
                        { speaker: "hero", text: "Тогда вы знаете, зачем я здесь." },
                        { speaker: "target", text: "Знаю. Но давайте поговорим. Возможно, мы можем договориться." }
                    ],
                    choices: [
                        { 
                            text: "Listen to the offer", 
                            nextScene: "vip_deal",
                            required: null
                        },
                        { 
                            text: "Complete the mission", 
                            nextScene: "vip_mission_complete",
                            required: null
                        },
                        { 
                            text: "Try to negotiate", 
                            nextScene: "vip_negotiate",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_deal",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "target", text: "I can give you information that is more important than your current mission." },
                        { speaker: "target", text: "But in return you must help me with a problem." },
                        { speaker: "hero", text: "Interesting. Tell me more." },
                        { speaker: "target", text: "Something bigger is happening in this casino than it seems. Someone is using it for money laundering." },
                        { speaker: "hero", text: "And you want me to investigate this?" },
                        { speaker: "target", text: "Именно. Помогите мне - и я дам вам то, что вам нужно." }
                    ],
                    choices: [
                        { 
                            text: "Agree to the deal", 
                            nextScene: "vip_deal_accepted",
                            required: null
                        },
                        { 
                            text: "Refuse", 
                            nextScene: "vip_mission_complete",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_negotiate",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "hero", text: "Может быть, мы можем найти компромисс?" },
                        { speaker: "target", text: "Возможно. Но что вы можете предложить?" },
                        { speaker: "hero", text: "Я могу помочь вам с вашей проблемой, но мне нужны гарантии." },
                        { speaker: "target", text: "Честно говоря, это лучше, чем я ожидала. Давайте договоримся." }
                    ],
                    choices: [
                        { 
                            text: "Accept the agreement", 
                            nextScene: "vip_deal_accepted",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_deal_accepted",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "satisfied" }
                    ],
                    dialogues: [
                        { speaker: "target", text: "Excellent. Here is the information you need." },
                        { speaker: "narrator", text: "Она передает вам конверт с документами." },
                        { speaker: "target", text: "Теперь ваша очередь. Найдите того, кто стоит за отмыванием денег." },
                        { speaker: "hero", text: "Спасибо. Я выполню свою часть сделки." },
                        { speaker: "narrator", text: "Вы получили новую информацию и новую миссию. История продолжается..." }
                    ],
                    choices: [
                        { 
                            text: "Начать расследование", 
                            nextScene: "investigation_start",
                            required: null
                        },
                        { 
                            text: "Return to main menu", 
                            nextScene: "main_menu",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "vip_mission_complete",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "triumphant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы выполнили свою миссию. Цель нейтрализована." },
                        { speaker: "hero", text: "Миссия выполнена. Но что-то подсказывает, что это только начало." },
                        { speaker: "narrator", text: "Вы покидаете VIP-зону, оставляя за собой завершенную миссию." }
                    ],
                    choices: [
                        { 
                            text: "Return to main menu", 
                            nextScene: "main_menu",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "investigation_start",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы начинаете расследование. Документы указывают на несколько подозрительных операций." },
                        { speaker: "hero", text: "Нужно проверить финансовые операции казино. Начну с главного офиса." },
                        { speaker: "narrator", text: "Но доступ туда ограничен. Нужно найти способ попасть внутрь." }
                    ],
                    choices: [
                        { 
                            text: "Try hacking the security system", 
                            nextScene: "office_hack",
                            required: null
                        },
                        { 
                            text: "Найти сотрудника, который может помочь", 
                            nextScene: "find_employee",
                            required: null
                        },
                        { 
                            text: "Wait for the right moment", 
                            nextScene: "office_wait",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "office_hack",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы находите компьютер с доступом к системе безопасности." },
                        { speaker: "hero", text: "Это может быть сложно, но я попробую." }
                    ],
                    choices: [],
                    minigame: "slots",
                    onMinigameComplete: {
                        jackpot: {
                            sceneId: "office_hack_success",
                            dialogues: [
                                { speaker: "narrator", text: "Система взломана! Вы получили доступ к финансовым записям." },
                                { speaker: "hero", text: "Отлично! Теперь я вижу, что происходит." }
                            ]
                        },
                        win: {
                            sceneId: "office_hack_partial",
                            dialogues: [
                                { speaker: "narrator", text: "Частичный доступ получен. Вы видите часть информации." }
                            ]
                        },
                        lose: {
                            sceneId: "office_hack_fail",
                            dialogues: [
                                { speaker: "narrator", text: "Взлом не удался. Система безопасности сработала." }
                            ]
                        }
                    }
                },
                {
                    sceneId: "office_hack_success",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "satisfied" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы нашли доказательства отмывания денег. Главный подозреваемый - директор казино." },
                        { speaker: "hero", text: "Теперь нужно собрать больше доказательств и передать их." },
                        { speaker: "narrator", text: "Миссия выполнена. Вы раскрыли заговор." }
                    ],
                    choices: [
                        { 
                            text: "Завершить миссию", 
                            nextScene: "finale_success",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "office_hack_partial",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы видите часть информации, но нужны дополнительные доказательства." },
                        { speaker: "hero", text: "Нужно найти другой способ получить полный доступ." }
                    ],
                    choices: [
                        { 
                            text: "Try again", 
                            nextScene: "office_hack",
                            required: null
                        },
                        { 
                            text: "Найти сотрудника", 
                            nextScene: "find_employee",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "office_hack_fail",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "cautious" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Взлом не удался. Охранники могут быть на пути." },
                        { speaker: "hero", text: "Нужно быстро найти другой способ." }
                    ],
                    choices: [
                        { 
                            text: "Найти сотрудника", 
                            nextScene: "find_employee",
                            required: null
                        },
                        { 
                            text: "Try a different approach", 
                            nextScene: "investigation_start",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "find_employee",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы находите сотрудника, который выглядит недовольным." },
                        { speaker: "employee", text: "Я знаю, что здесь происходит что-то неладное. Но боюсь говорить." },
                        { speaker: "hero", text: "Я могу помочь. Но мне нужна информация." },
                        { speaker: "employee", text: "Хорошо. Но только если вы обещаете защитить меня." }
                    ],
                    choices: [
                        { 
                            text: "Пообещать защиту", 
                            nextScene: "employee_info",
                            required: null
                        },
                        { 
                            text: "Предложить деньги", 
                            nextScene: "employee_bribe",
                            required: "ticket"
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "employee_info",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "left", emotion: "satisfied" }
                    ],
                    dialogues: [
                        { speaker: "employee", text: "Директор казино отмывает деньги через подставные компании." },
                        { speaker: "employee", text: "У меня есть документы, которые это доказывают." },
                        { speaker: "narrator", text: "Сотрудник передает вам папку с документами." },
                        { speaker: "hero", text: "Спасибо. Это очень поможет." }
                    ],
                    choices: [
                        { 
                            text: "Передать доказательства", 
                            nextScene: "finale_success",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "employee_bribe",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "left", emotion: "confident" }
                    ],
                    dialogues: [
                        { speaker: "employee", text: "Хм... Это меняет дело." },
                        { speaker: "narrator", text: "Сотрудник берет деньги и передает вам информацию." },
                        { speaker: "employee", text: "Вот все, что я знаю. Теперь оставьте меня в покое." }
                    ],
                    choices: [
                        { 
                            text: "Использовать информацию", 
                            nextScene: "finale_success",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "office_wait",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "observant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы ждете подходящего момента. Время идет медленно." },
                        { speaker: "narrator", text: "Наконец, директор покидает офис. Охранники следуют за ним." },
                        { speaker: "hero", text: "Идеальный момент. Теперь я могу попасть внутрь." }
                    ],
                    choices: [
                        { 
                            text: "Enter the office", 
                            nextScene: "office_search",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "office_search",
                    background: "casino_interior",
                    characters: [
                        { name: "hero", position: "center", emotion: "focused" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы обыскиваете офис директора. В сейфе находите важные документы." },
                        { speaker: "hero", text: "Вот оно! Доказательства отмывания денег." },
                        { speaker: "narrator", text: "Вы фотографируете документы и покидаете офис." }
                    ],
                    choices: [
                        { 
                            text: "Передать доказательства", 
                            nextScene: "finale_success",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "finale_success",
                    background: "casino_lobby",
                    characters: [
                        { name: "hero", position: "center", emotion: "triumphant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "Вы успешно завершили миссию. Доказательства переданы." },
                        { speaker: "narrator", text: "Заговор раскрыт, виновные будут наказаны." },
                        { speaker: "hero", text: "Миссия выполнена. Но это только первая волна удачи..." },
                        { speaker: "narrator", text: "Глава 1 завершена успешно! Следите за обновлениями для продолжения истории!" }
                    ],
                    choices: [
                        { 
                            text: "Return to main menu", 
                            nextScene: "main_menu",
                            required: null
                        }
                    ],
                    minigame: null
                },
                {
                    sceneId: "finale",
                    background: "casino_vip",
                    characters: [
                        { name: "hero", position: "left", emotion: "triumphant" }
                    ],
                    dialogues: [
                        { speaker: "narrator", text: "You completed your mission. The wave of luck was on your side." },
                        { speaker: "hero", text: "Chapter 1 is complete. But this is only the beginning..." },
                        { speaker: "narrator", text: "Chapter 1 completed. Stay tuned for updates to continue the story!" }
                    ],
                    choices: [
                        { 
                            text: "Return to main menu", 
                            nextScene: "main_menu",
                            required: null
                        }
                    ],
                    minigame: null
                }
            ]
        };
    }
}

// Экспорт
window.StoryData = StoryData;

