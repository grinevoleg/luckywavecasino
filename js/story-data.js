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
                        { speaker: "narrator", text: "VIP area. Only the most important guests play here." },
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
                        { speaker: "hero", text: "Need to be more careful. I'll try a different approach." }
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
                        { speaker: "bartender", text: "No luck. Maybe next time?" },
                        { speaker: "narrator", text: "The bartender leaves, leaving you without information." },
                        { speaker: "hero", text: "Need to find another way to get information." }
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
                        { speaker: "bartender", text: "Draw. But for persistence - a small hint: look in the slots." },
                        { speaker: "hero", text: "Thanks. That will help." }
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
                        { speaker: "bartender", text: "You're here again. Need something else?" },
                        { speaker: "hero", text: "Maybe you know something else about the VIP area?" },
                        { speaker: "bartender", text: "There's strict security there. You can't get through without a pass." },
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
                        { speaker: "narrator", text: "You won the tournament! The VIP pass is yours." },
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
                        { speaker: "narrator", text: "Tournament lost. Need to find another way." },
                        { speaker: "hero", text: "No luck. But I won't give up." }
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
                        { speaker: "narrator", text: "You approach the VIP entrance. The guard checks your pass." },
                        { speaker: "narrator", text: "The pass is valid. The guard lets you through." },
                        { speaker: "hero", text: "Great. Now I need to find the target." }
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
                        { speaker: "narrator", text: "You approach the guard with an offer." },
                        { speaker: "narrator", text: "The guard hesitates, but accepts your offer." },
                        { speaker: "hero", text: "Money solves a lot in this world." }
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
                        { speaker: "narrator", text: "VIP area. Only the most important guests play here." },
                        { speaker: "narrator", text: "Luxury is everywhere. Golden chandeliers, velvet carpets, expensive drinks." },
                        { speaker: "narrator", text: "You look around the hall and see your target - she's sitting at a table in the far corner." },
                        { speaker: "hero", text: "There she is. My mission is almost complete..." },
                        { speaker: "narrator", text: "But there are several guards around her. Need to be careful." }
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
                        { speaker: "narrator", text: "You approach the target directly. The guards are alert." },
                        { speaker: "narrator", text: "But your confidence and pass do their job - they let you through." },
                        { speaker: "hero", text: "Sometimes the best tactic is directness." }
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
                        { speaker: "narrator", text: "You wait for the right moment. Time passes slowly." },
                        { speaker: "narrator", text: "Finally, the target gets up and heads to the exit. The guards follow her." },
                        { speaker: "hero", text: "Perfect moment. Now I can approach unnoticed." }
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
                        { speaker: "narrator", text: "You create a small incident - drop a glass, attracting the guards' attention." },
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
                        { speaker: "hero", text: "Then you know why I'm here." },
                        { speaker: "target", text: "I know. But let's talk. Maybe we can come to an agreement." }
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
                        { speaker: "target", text: "Exactly. Help me - and I'll give you what you need." }
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
                        { speaker: "hero", text: "Maybe we can find a compromise?" },
                        { speaker: "target", text: "Maybe. But what can you offer?" },
                        { speaker: "hero", text: "I can help you with your problem, but I need guarantees." },
                        { speaker: "target", text: "Honestly, this is better than I expected. Let's make a deal." }
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
                        { speaker: "narrator", text: "She hands you an envelope with documents." },
                        { speaker: "target", text: "Now it's your turn. Find the one behind the money laundering." },
                        { speaker: "hero", text: "Thanks. I'll fulfill my part of the deal." },
                        { speaker: "narrator", text: "You received new information and a new mission. The story continues..." }
                    ],
                    choices: [
                        { 
                            text: "Start Investigation", 
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
                        { speaker: "narrator", text: "You completed your mission. Target neutralized." },
                        { speaker: "hero", text: "Mission accomplished. But something tells me this is just the beginning." },
                        { speaker: "narrator", text: "You leave the VIP area, leaving behind a completed mission." }
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
                        { speaker: "narrator", text: "You start the investigation. The documents point to several suspicious operations." },
                        { speaker: "hero", text: "Need to check the casino's financial operations. I'll start with the main office." },
                        { speaker: "narrator", text: "But access there is limited. Need to find a way to get inside." }
                    ],
                    choices: [
                        { 
                            text: "Try hacking the security system", 
                            nextScene: "office_hack",
                            required: null
                        },
                        { 
                            text: "Find an employee who can help", 
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
                        { speaker: "narrator", text: "You find a computer with access to the security system." },
                        { speaker: "hero", text: "This might be difficult, but I'll try." }
                    ],
                    choices: [],
                    minigame: "slots",
                    onMinigameComplete: {
                        jackpot: {
                            sceneId: "office_hack_success",
                            dialogues: [
                                { speaker: "narrator", text: "System hacked! You gained access to financial records." },
                                { speaker: "hero", text: "Excellent! Now I can see what's happening." }
                            ]
                        },
                        win: {
                            sceneId: "office_hack_partial",
                            dialogues: [
                                { speaker: "narrator", text: "Partial access obtained. You see part of the information." }
                            ]
                        },
                        lose: {
                            sceneId: "office_hack_fail",
                            dialogues: [
                                { speaker: "narrator", text: "Hack failed. Security system activated." }
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
                        { speaker: "narrator", text: "You found evidence of money laundering. The main suspect is the casino director." },
                        { speaker: "hero", text: "Now need to gather more evidence and hand it over." },
                        { speaker: "narrator", text: "Mission accomplished. You uncovered the conspiracy." }
                    ],
                    choices: [
                        { 
                            text: "Complete Mission", 
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
                        { speaker: "narrator", text: "You see part of the information, but need additional evidence." },
                        { speaker: "hero", text: "Need to find another way to get full access." }
                    ],
                    choices: [
                        { 
                            text: "Try again", 
                            nextScene: "office_hack",
                            required: null
                        },
                        { 
                            text: "Find Employee", 
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
                        { speaker: "narrator", text: "Hack failed. Guards may be on the way." },
                        { speaker: "hero", text: "Need to quickly find another way." }
                    ],
                    choices: [
                        { 
                            text: "Find Employee", 
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
                        { speaker: "narrator", text: "You find an employee who looks dissatisfied." },
                        { speaker: "employee", text: "I know something wrong is happening here. But I'm afraid to speak." },
                        { speaker: "hero", text: "I can help. But I need information." },
                        { speaker: "employee", text: "Okay. But only if you promise to protect me." }
                    ],
                    choices: [
                        { 
                            text: "Promise Protection", 
                            nextScene: "employee_info",
                            required: null
                        },
                        { 
                            text: "Offer Money", 
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
                        { speaker: "employee", text: "The casino director launders money through shell companies." },
                        { speaker: "employee", text: "I have documents that prove it." },
                        { speaker: "narrator", text: "The employee hands you a folder with documents." },
                        { speaker: "hero", text: "Thanks. This will help a lot." }
                    ],
                    choices: [
                        { 
                            text: "Hand Over Evidence", 
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
                        { speaker: "employee", text: "Hmm... This changes things." },
                        { speaker: "narrator", text: "The employee takes the money and gives you information." },
                        { speaker: "employee", text: "That's all I know. Now leave me alone." }
                    ],
                    choices: [
                        { 
                            text: "Use Information", 
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
                        { speaker: "narrator", text: "You wait for the right moment. Time passes slowly." },
                        { speaker: "narrator", text: "Finally, the director leaves the office. Guards follow him." },
                        { speaker: "hero", text: "Perfect moment. Now I can get inside." }
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
                        { speaker: "narrator", text: "You search the director's office. In the safe you find important documents." },
                        { speaker: "hero", text: "There it is! Evidence of money laundering." },
                        { speaker: "narrator", text: "You photograph the documents and leave the office." }
                    ],
                    choices: [
                        { 
                            text: "Hand Over Evidence", 
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
                        { speaker: "narrator", text: "You successfully completed the mission. Evidence handed over." },
                        { speaker: "narrator", text: "Conspiracy uncovered, the guilty will be punished." },
                        { speaker: "hero", text: "Mission accomplished. But this is only the first wave of luck..." },
                        { speaker: "narrator", text: "Chapter 1 completed successfully! Stay tuned for updates to continue the story!" }
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

