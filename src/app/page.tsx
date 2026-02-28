'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// GitHub Pages basePath
const basePath = process.env.NODE_ENV === 'production' ? '/mystical-divination' : ''

// ==================== 算卦数据 ====================
const hexagrams = [
  { name: '乾', symbol: '☰', meaning: '天行健，君子以自强不息。大吉大利，事业亨通，刚健进取。', detail: '此卦为纯阳之卦，象征天道的刚健与永恒。占得此卦，预示着事业将有大发展，但需保持谦逊，不可骄傲自满。' },
  { name: '坤', symbol: '☷', meaning: '地势坤，君子以厚德载物。柔顺谦和，厚积薄发。', detail: '此卦为纯阴之卦，象征大地的包容与承载。占得此卦，宜守不宜攻，以柔克刚，厚积薄发方能成功。' },
  { name: '屯', symbol: '☳☵', meaning: '云雷屯，君子以经纶。创业维艰，需耐心等待时机。', detail: '此卦象征万物初生之难，事业初创阶段困难重重，但只要坚持不懈，终将迎来转机。' },
  { name: '蒙', symbol: '☶☵', meaning: '山下出泉，蒙。启蒙开智，虚心求教。', detail: '此卦象征启蒙教育，占得此卦说明需要学习新知识，虚心向他人请教，方能突破困境。' },
  { name: '需', symbol: '☵☰', meaning: '云上于天，需。等待时机，从容不迫。', detail: '此卦象征等待，凡事不可急于求成，需要耐心等待时机成熟，方能水到渠成。' },
  { name: '讼', symbol: '☰☵', meaning: '天与水违行，讼。慎争戒讼，以和为贵。', detail: '此卦象征争讼，占得此卦宜退让为上，避免正面冲突，以和为贵方能化解矛盾。' },
  { name: '师', symbol: '☷☵', meaning: '地中有水，师。统帅有方，纪律严明。', detail: '此卦象征军队与领导，占得此卦说明需要有人引领，或自己需要承担领导责任。' },
  { name: '比', symbol: '☵☷', meaning: '地上有水，比。亲比和谐，团结互助。', detail: '此卦象征亲密团结，占得此卦说明需要与他人合作，团结一致方能成功。' },
  { name: '小畜', symbol: '☴☰', meaning: '风行天上，小畜。积蓄力量，循序渐进。', detail: '此卦象征小有积蓄，力量尚不足以大作为，需要继续积累，等待时机。' },
  { name: '履', symbol: '☰☱', meaning: '上天下泽，履。谨慎行事，如履薄冰。', detail: '此卦象征谨慎行事，占得此卦需要小心谨慎，不可鲁莽行事，方能化险为夷。' },
  { name: '泰', symbol: '☷☰', meaning: '天地交，泰。通达顺利，万事亨通。', detail: '此卦为吉卦，象征天地交融，阴阳调和，占得此卦预示着好运将至，事业顺遂。' },
  { name: '否', symbol: '☰☷', meaning: '天地不交，否。闭塞不通，韬光养晦。', detail: '此卦象征闭塞不通，占得此卦说明当前运势不佳，需要韬光养晦，等待转机。' },
  { name: '同人', symbol: '☰☲', meaning: '天与火，同人。志同道合，团结协作。', detail: '此卦象征志同道合，占得此卦说明需要寻找志同道合之人，共同合作方能成功。' },
  { name: '大有', symbol: '☲☰', meaning: '火在天上，大有。光明普照，收获丰盛。', detail: '此卦为吉卦，象征大有收获，占得此卦预示着事业将有大发展，收获丰厚。' },
  { name: '谦', symbol: '☷☶', meaning: '地中有山，谦。谦虚谨慎，德行高尚。', detail: '此卦象征谦虚，占得此卦说明需要保持谦逊的态度，谦虚使人进步，骄傲使人落后。' },
  { name: '豫', symbol: '☳☷', meaning: '雷出地奋，豫。欢乐愉悦，未雨绸缪。', detail: '此卦象征欢乐，占得此卦说明当前心情愉悦，但不可过于放纵，需要未雨绸缪。' },
  { name: '随', symbol: '☱☳', meaning: '泽中有雷，随。随机应变，顺势而为。', detail: '此卦象征随顺，占得此卦说明需要顺应时势，灵活变通，不可固执己见。' },
  { name: '蛊', symbol: '☶☴', meaning: '山下有风，蛊。整治弊病，革故鼎新。', detail: '此卦象征整治弊病，占得此卦说明需要发现问题并解决问题，革故鼎新方能进步。' },
  { name: '临', symbol: '☷☱', meaning: '泽上有地，临。居高临下，亲临指导。', detail: '此卦象征君临，占得此卦说明需要亲自参与，亲力亲为方能成功。' },
  { name: '观', symbol: '☴☷', meaning: '风行地上，观。观察审视，明辨是非。', detail: '此卦象征观察，占得此卦说明需要仔细观察形势，明辨是非后再做决定。' },
  { name: '噬嗑', symbol: '☲☳', meaning: '雷电噬嗑，先王以明罚敕法。明断是非，公正执法。', detail: '此卦象征决断，占得此卦说明需要果断决策，明辨是非，不可优柔寡断。' },
  { name: '贲', symbol: '☶☲', meaning: '山下有火，贲。文饰修饰，外表华美。', detail: '此卦象征文饰，占得此卦说明需要注重外表形象，但不可华而不实。' },
  { name: '剥', symbol: '☶☷', meaning: '山附于地，剥。剥落衰败，守正待时。', detail: '此卦象征剥落，占得此卦说明当前运势不佳，需要坚守正道，等待时机好转。' },
  { name: '复', symbol: '☷☳', meaning: '雷在地中，复。一阳来复，否极泰来。', detail: '此卦象征回复，占得此卦说明运势即将好转，新的希望正在孕育之中。' },
  { name: '无妄', symbol: '☰☳', meaning: '天下雷行，无妄。诚实守信，不可妄为。', detail: '此卦象征无妄，占得此卦说明需要诚实守信，不可有非分之想，顺其自然。' },
  { name: '大畜', symbol: '☶☰', meaning: '天在山中，大畜。积蓄力量，厚积薄发。', detail: '此卦象征大积蓄，占得此卦说明需要积累知识和财富，为将来的发展做准备。' },
  { name: '颐', symbol: '☶☳', meaning: '山下有雷，颐。颐养身心，谨言慎行。', detail: '此卦象征颐养，占得此卦说明需要注重身心健康，谨言慎行，保养精神。' },
  { name: '大过', symbol: '☱☴', meaning: '泽灭木，大过。过分过度，量力而行。', detail: '此卦象征过分，占得此卦说明当前可能有些过度，需要适当收敛，量力而行。' },
  { name: '坎', symbol: '☵☵', meaning: '水洊至，坎。险难重重，坚守信念。', detail: '此卦象征险难，占得此卦说明当前困难重重，需要坚定信念，方能渡过难关。' },
  { name: '离', symbol: '☲☲', meaning: '明两作，离。光明照耀，依附正道。', detail: '此卦象征光明，占得此卦说明前途光明，但需要依附正道，不可偏离方向。' },
  { name: '咸', symbol: '☱☶', meaning: '山上有泽，咸。感应相通，心心相印。', detail: '此卦象征感应，占得此卦说明人际关系和谐，感情方面有好的发展。' },
  { name: '恒', symbol: '☳☴', meaning: '雷风恒，恒。持之以恒，始终如一。', detail: '此卦象征恒久，占得此卦说明需要坚持不懈，始终如一，方能成功。' },
  { name: '遁', symbol: '☰☶', meaning: '天下有山，遁。退避三舍，明哲保身。', detail: '此卦象征退避，占得此卦说明当前不宜进取，需要暂时退避，明哲保身。' },
  { name: '大壮', symbol: '☳☰', meaning: '雷在天上，大壮。刚健有力，正大光明。', detail: '此卦象征壮大，占得此卦说明力量充足，可以积极进取，但需正大光明。' },
  { name: '晋', symbol: '☲☷', meaning: '明出地上，晋。进取上升，前途光明。', detail: '此卦象征晋升，占得此卦说明事业将有所上升，前途光明，宜积极进取。' },
  { name: '明夷', symbol: '☷☲', meaning: '明入地中，明夷。光明受损，韬光养晦。', detail: '此卦象征光明受损，占得此卦说明当前处境艰难，需要韬光养晦，等待时机。' },
  { name: '家人', symbol: '☴☲', meaning: '风自火出，家人。家庭和睦，齐家治国。', detail: '此卦象征家庭，占得此卦说明家庭和睦是事业成功的基础，需要注重家庭关系。' },
  { name: '睽', symbol: '☲☱', meaning: '火泽睽，睽。意见相左，求同存异。', detail: '此卦象征背离，占得此卦说明与他人意见不合，需要求同存异，化解矛盾。' },
  { name: '蹇', symbol: '☵☶', meaning: '山上有水，蹇。艰难险阻，知难而进。', detail: '此卦象征艰难，占得此卦说明前路困难重重，需要知难而进，不畏艰险。' },
  { name: '解', symbol: '☳☵', meaning: '雷雨作，解。解除困难，柳暗花明。', detail: '此卦象征解脱，占得此卦说明困难即将解除，柳暗花明又一村。' },
  { name: '损', symbol: '☶☱', meaning: '山下有泽，损。减损多余，益于不足。', detail: '此卦象征减损，占得此卦说明需要适当舍弃，方能有所收获。' },
  { name: '益', symbol: '☴☳', meaning: '风雷益，益。增益补益，利有攸往。', detail: '此卦象征增益，占得此卦说明将有所收获，事业有所发展。' },
  { name: '夬', symbol: '☱☰', meaning: '泽上于天，夬。果断决断，去除小人。', detail: '此卦象征决断，占得此卦说明需要果断决策，去除不利因素。' },
  { name: '姤', symbol: '☰☴', meaning: '天下有风，姤。不期而遇，谨慎交往。', detail: '此卦象征相遇，占得此卦说明将有意外相遇，但需谨慎对待。' },
  { name: '萃', symbol: '☱☷', meaning: '泽上于地，萃。聚集会合，众志成城。', detail: '此卦象征聚集，占得此卦说明需要团结众人，集思广益。' },
  { name: '升', symbol: '☷☴', meaning: '地中生木，升。步步高升，积小成大。', detail: '此卦象征上升，占得此卦说明事业将有所上升，需要循序渐进。' },
  { name: '困', symbol: '☱☵', meaning: '泽无水，困。困境重重，坚守正道。', detail: '此卦象征困顿，占得此卦说明当前处境困难，需要坚守正道，等待转机。' },
  { name: '井', symbol: '☵☴', meaning: '木上有水，井。取之不尽，用之不竭。', detail: '此卦象征水井，占得此卦说明资源丰富，需要善加利用。' },
  { name: '革', symbol: '☱☲', meaning: '泽中有火，革。变革更新，除旧布新。', detail: '此卦象征变革，占得此卦说明需要改革创新，除旧布新。' },
  { name: '鼎', symbol: '☲☴', meaning: '木上有火，鼎。革故鼎新，成就大业。', detail: '此卦象征鼎新，占得此卦说明事业将有所成就，需要把握机会。' },
  { name: '震', symbol: '☳☳', meaning: '洊雷震，震。震动惊惧，谨慎行事。', detail: '此卦象征震动，占得此卦说明将有变动，需要谨慎应对。' },
  { name: '艮', symbol: '☶☶', meaning: '兼山艮，艮。止其所止，适可而止。', detail: '此卦象征停止，占得此卦说明需要适可而止，不可过分追求。' },
  { name: '渐', symbol: '☴☶', meaning: '山上有木，渐。循序渐进，稳步发展。', detail: '此卦象征渐进，占得此卦说明需要循序渐进，不可急于求成。' },
  { name: '归妹', symbol: '☳☱', meaning: '泽上有雷，归妹。归宿有定，顺应自然。', detail: '此卦象征归宿，占得此卦说明事物将有其归宿，顺应自然发展。' },
  { name: '丰', symbol: '☳☲', meaning: '雷电皆至，丰。丰盛繁荣，居安思危。', detail: '此卦象征丰盛，占得此卦说明事业繁荣，但需居安思危。' },
  { name: '旅', symbol: '☲☶', meaning: '山上有火，旅。旅途奔波，谨慎行事。', detail: '此卦象征旅行，占得此卦说明可能需要外出，或处于不稳定状态。' },
  { name: '巽', symbol: '☴☴', meaning: '随风巽，巽。顺从谦逊，随风而动。', detail: '此卦象征顺从，占得此卦说明需要顺应形势，灵活变通。' },
  { name: '兑', symbol: '☱☱', meaning: '丽泽兑，兑。喜悦和谐，利于交往。', detail: '此卦象征喜悦，占得此卦说明人际关系和谐，心情愉悦。' },
  { name: '涣', symbol: '☴☵', meaning: '风行水上，涣。涣散离析，重新整合。', detail: '此卦象征涣散，占得此卦说明需要重新整合资源，化解矛盾。' },
  { name: '节', symbol: '☵☱', meaning: '泽上有水，节。节制适度，恰到好处。', detail: '此卦象征节制，占得此卦说明需要适度节制，不可过分。' },
  { name: '中孚', symbol: '☴☱', meaning: '泽上有风，中孚。诚信为本，感化他人。', detail: '此卦象征诚信，占得此卦说明需要以诚待人，方能获得信任。' },
  { name: '小过', symbol: '☳☶', meaning: '山上有雷，小过。稍有过度，适可而止。', detail: '此卦象征小有过失，占得此卦说明需要适当收敛，不可过分。' },
  { name: '既济', symbol: '☵☲', meaning: '水在火上，既济。功成名就，善始善终。', detail: '此卦象征成功，占得此卦说明事业已经成功，但需要善始善终。' },
  { name: '未济', symbol: '☲☵', meaning: '火在水上，未济。尚未成功，继续努力。', detail: '此卦象征未完成，占得此卦说明事业尚未成功，需要继续努力。' },
]

// ==================== 答案之书数据 ====================
const bookAnswers = [
  '是的，毫无疑问',
  '很有可能',
  '前景看好',
  '星辰指引你前行',
  '命运已注定',
  '相信你的直觉',
  '时机成熟',
  '一切皆有可能',
  '耐心等待',
  '答案就在你心中',
  '顺其自然',
  '勇敢迈出第一步',
  '机遇即将来临',
  '保持希望',
  '相信奇迹',
  '命运掌握在你手中',
  '现在是行动的时候',
  '放下执念',
  '静待花开',
  '相信过程',
  '一切都会好起来',
  '追随你的心',
  '不要犹豫',
  '改变即将发生',
  '保持积极',
  '相信自己的力量',
  '转机就在眼前',
  '放下过去',
  '拥抱变化',
  '好运正在路上',
  '坚持就是胜利',
  '答案是否定的',
  '现在不是好时机',
  '需要重新考虑',
  '暂时不要行动',
  '等待更好的机会',
  '不要强求',
  '顺其自然吧',
  '也许吧',
  '一切尚未明朗',
  '需要更多时间',
  '保持谨慎',
  '不要着急',
  '倾听内心的声音',
  '相信命运的安排',
  '放下担忧',
  '专注于当下',
  '一切都有可能',
  '保持开放的心态',
  '答案就在眼前',
]

// ==================== 塔罗牌数据 ====================
const tarotCards = [
  { name: '愚者', numeral: '0', meaning: '新的开始，冒险精神，纯真无畏', detail: '愚者代表着无限的可能性和新的开始。他站在悬崖边缘，却毫无畏惧，象征着纯真和冒险精神。这张牌提醒你，有时候需要放下顾虑，勇敢地迈出第一步。' },
  { name: '魔术师', numeral: 'I', meaning: '创造力，技能，意志力', detail: '魔术师象征着创造力和将想法转化为现实的能力。他拥有四大元素的象征物，代表着他掌握了所有必要的工具。这张牌提醒你，你已经拥有实现目标所需的一切资源。' },
  { name: '女祭司', numeral: 'II', meaning: '直觉，神秘，潜意识', detail: '女祭司代表着直觉和内在智慧。她坐在两根柱子之间，象征着在二元对立中保持平衡。这张牌提醒你，要倾听内心的声音，相信自己的直觉。' },
  { name: '女皇', numeral: 'III', meaning: '丰饶，母性，自然', detail: '女皇象征着丰饶、创造和母性。她代表着大自然的孕育力量和生命的美好。这张牌预示着丰收和繁荣，也提醒你关注自己的身心健康。' },
  { name: '皇帝', numeral: 'IV', meaning: '权威，结构，控制', detail: '皇帝代表着权威、秩序和稳定。他象征着父性力量和领导能力。这张牌提醒你，需要建立秩序和结构，承担责任，做出果断的决策。' },
  { name: '教皇', numeral: 'V', meaning: '传统，信仰，指导', detail: '教皇象征着传统价值观和精神指导。他代表着宗教、教育和道德准则。这张牌提醒你，可以寻求他人的帮助和指导，或者遵循传统的智慧。' },
  { name: '恋人', numeral: 'VI', meaning: '爱情，选择，和谐', detail: '恋人牌代表着爱情、选择和价值观的统一。它不仅指浪漫关系，也象征着重要的选择。这张牌提醒你，要忠于自己的内心，做出符合价值观的选择。' },
  { name: '战车', numeral: 'VII', meaning: '意志力，胜利，决心', detail: '战车象征着意志力和决心带来的胜利。驾驶者控制着两只斯芬克斯，代表着掌控对立力量的能力。这张牌提醒你，坚定意志，勇往直前，必将取得胜利。' },
  { name: '力量', numeral: 'VIII', meaning: '内在力量，勇气，耐心', detail: '力量牌代表着内在的勇气和耐心。女子轻柔地抚摸狮子，象征着以柔克刚的智慧。这张牌提醒你，真正的力量来自于内心的平静和自信。' },
  { name: '隐士', numeral: 'IX', meaning: '内省，寻求真理，孤独', detail: '隐士象征着内省和寻求真理。他独自站在山顶，手持明灯，代表着内在的指引。这张牌提醒你，有时候需要独处，倾听内心的声音。' },
  { name: '命运之轮', numeral: 'X', meaning: '命运，转折点，循环', detail: '命运之轮代表着命运的循环和转折点。轮子不断转动，象征着生命的起伏变化。这张牌提醒你，接受变化，顺应命运的安排。' },
  { name: '正义', numeral: 'XI', meaning: '公正，真理，因果', detail: '正义牌象征着公正、真理和因果法则。她手持天平和宝剑，代表着公正的判断。这张牌提醒你，要诚实面对自己和他人，因果终有报。' },
  { name: '倒吊人', numeral: 'XII', meaning: '牺牲，新视角，等待', detail: '倒吊人代表着牺牲和获得新视角。他倒挂在树上，却面带平静，象征着通过放下获得智慧。这张牌提醒你，有时候需要改变视角，才能看到新的可能。' },
  { name: '死神', numeral: 'XIII', meaning: '结束，转变，新生', detail: '死神牌象征着结束和新的开始。它不代表肉体的死亡，而是旧事物的终结。这张牌提醒你，接受必要的结束，为新的开始腾出空间。' },
  { name: '节制', numeral: 'XIV', meaning: '平衡，调和，耐心', detail: '节制牌代表着平衡和调和。天使将两杯水混合，象征着找到中庸之道。这张牌提醒你，保持平衡，避免极端，耐心等待事物的成熟。' },
  { name: '恶魔', numeral: 'XV', meaning: '束缚，诱惑，物质', detail: '恶魔牌象征着束缚和诱惑。它代表着被物质欲望或不良习惯所困。这张牌提醒你，审视自己的束缚，认识到这些枷锁往往源于自己的选择。' },
  { name: '塔', numeral: 'XVI', meaning: '突变，毁灭，觉醒', detail: '塔牌代表着突然的变化和旧结构的崩塌。闪电击中高塔，象征着不可避免的改变。这张牌提醒你，虽然变化可能令人不安，但它为重建创造了机会。' },
  { name: '星星', numeral: 'XVII', meaning: '希望，灵感，平静', detail: '星星牌象征着希望和内心的平静。女子在星空下倒水，代表着与宇宙的连接。这张牌提醒你，保持希望，相信美好的事物即将到来。' },
  { name: '月亮', numeral: 'XVIII', meaning: '幻觉，恐惧，潜意识', detail: '月亮牌代表着幻觉和潜意识中的恐惧。月光照亮了通往未知的道路。这张牌提醒你，面对内心的恐惧，区分幻觉与现实。' },
  { name: '太阳', numeral: 'XIX', meaning: '成功，喜悦，活力', detail: '太阳牌象征着成功、喜悦和生命力。阳光下孩童骑马，代表着纯真和快乐。这张牌预示着光明和成功，提醒你享受生活的美好。' },
  { name: '审判', numeral: 'XX', meaning: '觉醒，重生，召唤', detail: '审判牌代表着觉醒和重生。天使吹响号角，死者从坟墓中升起。这张牌提醒你，这是反思过去、迎接新生的时刻。' },
  { name: '世界', numeral: 'XXI', meaning: '完成，成就，圆满', detail: '世界牌象征着完成和圆满。舞者被花环环绕，代表着旅程的终点和新的开始。这张牌预示着目标的实现和人生的圆满。' },
]

// ==================== 主组件 ====================
export default function Home() {
  const [activeTab, setActiveTab] = useState('iching')
  const [isAnimating, setIsAnimating] = useState(false)
  
  // 算卦状态
  const [ichingResult, setIchingResult] = useState<typeof hexagrams[0] | null>(null)
  const [ichingLines, setIchingLines] = useState<string[]>([])
  
  // 答案之书状态
  const [bookAnswer, setBookAnswer] = useState('')
  const [bookQuestion, setBookQuestion] = useState('')
  const [showBookAnswer, setShowBookAnswer] = useState(false)
  
  // 塔罗牌状态
  const [selectedCards, setSelectedCards] = useState<typeof tarotCards>([])
  const [tarotPhase, setTarotPhase] = useState<'select' | 'result'>('select')
  const [shuffledCards, setShuffledCards] = useState<typeof tarotCards>([])
  
  // 对话框状态
  const [showIchingDetail, setShowIchingDetail] = useState(false)
  const [showTarotDetail, setShowTarotDetail] = useState(false)
  const [selectedTarotCard, setSelectedTarotCard] = useState<typeof tarotCards[0] | null>(null)
  
  // AI选择状态
  const [showAISelector, setShowAISelector] = useState(false)
  const [aiSearchQuery, setAiSearchQuery] = useState('')
  const [pendingAIType, setPendingAIType] = useState<'iching' | 'tarot' | 'book' | null>(null)
  const [pendingAIData, setPendingAIData] = useState<any>(null)

  // AI服务列表
  const aiServices = [
    { name: '秘塔AI搜索', url: 'https://metaso.cn/?q=', icon: '🔮', color: 'from-purple-500 to-indigo-500' },
    { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: '🌙', color: 'from-blue-500 to-cyan-500' },
    { name: '通义千问', url: 'https://tongyi.aliyun.com/qianwen/', icon: '☁️', color: 'from-orange-500 to-red-500' },
    { name: '智谱清言', url: 'https://chatglm.cn/', icon: '💬', color: 'from-green-500 to-teal-500' },
    { name: '豆包', url: 'https://www.doubao.com/', icon: '🫘', color: 'from-pink-500 to-rose-500' },
    { name: 'Perplexity', url: 'https://www.perplexity.ai/search?q=', icon: '🌐', color: 'from-cyan-500 to-blue-500' },
  ]

  // 初始化塔罗牌
  useEffect(() => {
    setShuffledCards([...tarotCards].sort(() => Math.random() - 0.5))
  }, [])

  // 算卦功能
  const performIching = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIchingLines([])
    setIchingResult(null)

    const lines: string[] = []
    let lineIndex = 0
    
    const interval = setInterval(() => {
      if (lineIndex < 6) {
        const isYang = Math.random() > 0.5
        lines.push(isYang ? '—' : '- -')
        setIchingLines([...lines])
        lineIndex++
      } else {
        clearInterval(interval)
        const hexagramIndex = Math.floor(Math.random() * hexagrams.length)
        setIchingResult(hexagrams[hexagramIndex])
        setIsAnimating(false)
      }
    }, 300)
  }

  // 答案之书功能
  const performBookReading = () => {
    if (isAnimating || !bookQuestion.trim()) return
    setIsAnimating(true)
    setShowBookAnswer(false)
    
    setTimeout(() => {
      const answer = bookAnswers[Math.floor(Math.random() * bookAnswers.length)]
      setBookAnswer(answer)
      setShowBookAnswer(true)
      setIsAnimating(false)
    }, 1500)
  }

  // 塔罗牌选择
  const selectTarotCard = (card: typeof tarotCards[0]) => {
    if (selectedCards.length >= 3 || selectedCards.find(c => c.name === card.name)) return
    
    const newSelected = [...selectedCards, card]
    setSelectedCards(newSelected)
    
    if (newSelected.length === 3) {
      setTimeout(() => setTarotPhase('result'), 500)
    }
  }

  // 重置塔罗牌
  const resetTarot = () => {
    setSelectedCards([])
    setTarotPhase('select')
    setShuffledCards([...tarotCards].sort(() => Math.random() - 0.5))
  }

  // AI解释功能 - 显示AI选择界面
  const getAIExplanation = (type: 'iching' | 'tarot' | 'book', data: any) => {
    let searchQuery = ''
    if (type === 'iching') {
      searchQuery = `周易${data.name}卦详解运势解读人生建议`
    } else if (type === 'tarot') {
      searchQuery = `塔罗牌${data[0]?.name}${data[1]?.name}${data[2]?.name}组合解读过去现在未来`
    } else if (type === 'book') {
      searchQuery = `${data.answer}人生启示哲学意义`
    }
    
    setAiSearchQuery(searchQuery)
    setPendingAIType(type)
    setPendingAIData(data)
    setShowAISelector(true)
  }

  // 选择AI服务并跳转
  const openAIService = (service: typeof aiServices[0]) => {
    const url = service.url + encodeURIComponent(aiSearchQuery)
    window.open(url, '_blank')
    setShowAISelector(false)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 背景 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${basePath}/mystical-bg.png)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/80 via-indigo-900/70 to-black/90" />
      
      {/* 星星动画 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent mb-4 drop-shadow-lg">
            神秘占卜
          </h1>
          <p className="text-purple-200 text-lg md:text-xl">探索命运的奥秘，聆听宇宙的指引</p>
        </div>

        {/* 主卡片 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 bg-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-1 mb-8">
            <TabsTrigger 
              value="iching" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black rounded-lg transition-all duration-300 text-purple-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">☰</span>
                <span className="hidden sm:inline">周易算卦</span>
                <span className="sm:hidden">算卦</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="book" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black rounded-lg transition-all duration-300 text-purple-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">📖</span>
                <span className="hidden sm:inline">答案之书</span>
                <span className="sm:hidden">答案</span>
              </span>
            </TabsTrigger>
            <TabsTrigger 
              value="tarot" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-600 data-[state=active]:text-black rounded-lg transition-all duration-300 text-purple-200"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">🃏</span>
                <span className="hidden sm:inline">塔罗占卜</span>
                <span className="sm:hidden">塔罗</span>
              </span>
            </TabsTrigger>
          </TabsList>

          {/* 算卦面板 */}
          <TabsContent value="iching" className="mt-0">
            <Card className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl text-amber-200 flex items-center justify-center gap-3">
                  <img src={`${basePath}/iching-icon.png`} alt="易经" className="w-12 h-12 rounded-full border-2 border-amber-400/50" />
                  周易六十四卦
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  诚心祈愿，点击开始占卦
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 卦象显示 */}
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  {ichingLines.length > 0 && (
                    <div className="flex flex-col items-center mb-6">
                      {ichingLines.map((line, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-center transition-all duration-300"
                          style={{ animationDelay: `${i * 0.1}s` }}
                        >
                          {line === '—' ? (
                            // 阳爻 - 实线
                            <div className="w-24 md:w-32 h-3 md:h-4 bg-amber-400 rounded-sm my-1 animate-pulse shadow-lg shadow-amber-400/50" />
                          ) : (
                            // 阴爻 - 断线
                            <div className="flex gap-2 md:gap-3 my-1 animate-pulse">
                              <div className="w-10 md:w-14 h-3 md:h-4 bg-amber-400 rounded-sm shadow-lg shadow-amber-400/50" />
                              <div className="w-10 md:w-14 h-3 md:h-4 bg-amber-400 rounded-sm shadow-lg shadow-amber-400/50" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {ichingResult && (
                    <div className="text-center animate-in fade-in duration-500">
                      <div className="text-5xl md:text-7xl text-amber-400 mb-4 font-bold">
                        {ichingResult.name}
                      </div>
                      <div className="text-xl md:text-2xl text-amber-200 mb-4">
                        {ichingResult.meaning}
                      </div>
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button 
                          onClick={() => setShowIchingDetail(true)}
                          variant="outline" 
                          className="border-amber-500/50 text-amber-200 hover:bg-amber-500/20"
                        >
                          查看详解
                        </Button>
                        <Button 
                          onClick={() => getAIExplanation('iching', ichingResult)}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                        >
                          ✨ AI解读
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 开始按钮 */}
                <div className="flex justify-center">
                  <Button
                    onClick={performIching}
                    disabled={isAnimating}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isAnimating ? '占卦中...' : '开始占卦'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 答案之书面板 */}
          <TabsContent value="book" className="mt-0">
            <Card className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl text-amber-200 flex items-center justify-center gap-3">
                  <img src={`${basePath}/book-icon.png`} alt="答案之书" className="w-12 h-12 rounded-full border-2 border-amber-400/50" />
                  答案之书
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  在心中默念你的问题，然后翻开答案之书
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 问题输入 */}
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="text"
                    value={bookQuestion}
                    onChange={(e) => setBookQuestion(e.target.value)}
                    placeholder="在心中默念你的问题..."
                    className="w-full max-w-md px-6 py-4 rounded-xl bg-purple-800/50 border-2 border-purple-500/30 text-purple-100 placeholder-purple-300/50 focus:outline-none focus:border-amber-500/50 text-center text-lg"
                  />
                </div>

                {/* 答案显示 */}
                <div className="flex flex-col items-center justify-center min-h-[150px]">
                  {isAnimating && (
                    <div className="text-amber-300 text-xl animate-pulse">
                      翻开书中...
                    </div>
                  )}
                  {showBookAnswer && (
                    <div className="text-center animate-in fade-in zoom-in duration-500">
                      <div className="text-3xl md:text-4xl text-amber-300 font-bold mb-4">
                        ✨ {bookAnswer} ✨
                      </div>
                      <Button 
                        onClick={() => getAIExplanation('book', { question: bookQuestion, answer: bookAnswer })}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                      >
                        ✨ AI解读
                      </Button>
                    </div>
                  )}
                </div>

                {/* 翻书按钮 */}
                <div className="flex justify-center">
                  <Button
                    onClick={performBookReading}
                    disabled={isAnimating || !bookQuestion.trim()}
                    className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold text-lg px-8 py-6 rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isAnimating ? '寻找答案中...' : '翻开答案之书'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 塔罗牌面板 */}
          <TabsContent value="tarot" className="mt-0">
            <Card className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 backdrop-blur-md border-2 border-amber-500/30 shadow-2xl shadow-purple-500/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl md:text-3xl text-amber-200 flex items-center justify-center gap-3">
                  <img src={`${basePath}/tarot-icon.png`} alt="塔罗牌" className="w-12 h-12 rounded-full border-2 border-amber-400/50" />
                  塔罗牌占卜
                </CardTitle>
                <CardDescription className="text-purple-200 text-lg">
                  选择三张牌，揭示过去、现在与未来
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tarotPhase === 'select' ? (
                  <>
                    {/* 选择提示 */}
                    <div className="text-center text-amber-200 text-lg mb-4">
                      已选择 {selectedCards.length} / 3 张牌
                    </div>
                    
                    {/* 卡牌网格 */}
                    <div className="grid grid-cols-4 md:grid-cols-7 gap-2 md:gap-3">
                      {shuffledCards.map((card, index) => {
                        const isSelected = selectedCards.find(c => c.name === card.name)
                        return (
                          <button
                            key={index}
                            onClick={() => selectTarotCard(card)}
                            disabled={!!isSelected || selectedCards.length >= 3}
                            className={`aspect-[2/3] rounded-lg transition-all duration-300 ${
                              isSelected 
                                ? 'ring-4 ring-amber-400 scale-95 opacity-50' 
                                : 'hover:scale-105 hover:ring-2 hover:ring-amber-400/50'
                            }`}
                          >
                            <img 
                              src={`${basePath}/tarot-back.png`} 
                              alt="塔罗牌" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </button>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <>
                    {/* 结果展示 */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8">
                      {selectedCards.map((card, index) => (
                        <div 
                          key={index} 
                          className="text-center cursor-pointer transition-transform hover:scale-105"
                          onClick={() => {
                            setSelectedTarotCard(card)
                            setShowTarotDetail(true)
                          }}
                        >
                          <div className="text-purple-200 text-sm md:text-base mb-2">
                            {index === 0 ? '过去' : index === 1 ? '现在' : '未来'}
                          </div>
                          <div className="bg-gradient-to-br from-purple-800/80 to-indigo-800/80 rounded-xl p-3 md:p-4 border-2 border-amber-500/30">
                            <div className="text-amber-400 text-2xl md:text-3xl font-bold mb-1">
                              {card.numeral}
                            </div>
                            <div className="text-amber-200 text-lg md:text-xl font-bold mb-2">
                              {card.name}
                            </div>
                            <div className="text-purple-200 text-xs md:text-sm">
                              {card.meaning}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 综合解读 */}
                    <div className="text-center mt-6 p-4 bg-purple-800/30 rounded-xl border border-purple-500/20">
                      <div className="text-amber-200 text-lg mb-2">综合解读</div>
                      <div className="text-purple-100">
                        {selectedCards[0] && selectedCards[1] && selectedCards[2] && (
                          <p>
                            你的过去受到「{selectedCards[0].name}」的影响，{selectedCards[0].meaning}。
                            现在你正处于「{selectedCards[1].name}」的阶段，{selectedCards[1].meaning}。
                            未来将迎来「{selectedCards[2].name}」，{selectedCards[2].meaning}。
                          </p>
                        )}
                      </div>
                    </div>

                    {/* AI解读按钮 */}
                    <div className="flex justify-center mt-4">
                      <Button 
                        onClick={() => getAIExplanation('tarot', selectedCards)}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                      >
                        ✨ AI大师解读
                      </Button>
                    </div>

                    {/* 重新开始按钮 */}
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={resetTarot}
                        className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black font-bold px-8 py-4 rounded-xl shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105"
                      >
                        重新占卜
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部说明 */}
        <div className="text-center mt-8 text-purple-300/60 text-sm">
          <p>占卜仅供娱乐参考，人生道路由自己掌握 ✨</p>
        </div>
      </div>

      {/* 算卦详解对话框 */}
      <Dialog open={showIchingDetail} onOpenChange={setShowIchingDetail}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-amber-500/30 text-purple-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-200 text-2xl flex items-center gap-2">
              {ichingResult?.name} 卦详解
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-purple-200 text-base">
            {ichingResult?.detail}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* 塔罗牌详解对话框 */}
      <Dialog open={showTarotDetail} onOpenChange={setShowTarotDetail}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-amber-500/30 text-purple-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-200 text-2xl">
              {selectedTarotCard?.numeral} - {selectedTarotCard?.name}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-purple-200 text-base">
            {selectedTarotCard?.detail}
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* AI服务选择对话框 */}
      <Dialog open={showAISelector} onOpenChange={setShowAISelector}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-indigo-900 border-amber-500/30 text-purple-100 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-amber-200 text-2xl flex items-center gap-2">
              ✨ 选择AI服务
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-purple-200 text-sm mb-4">
              搜索内容：{aiSearchQuery}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {aiServices.map((service) => (
                <button
                  key={service.name}
                  onClick={() => openAIService(service)}
                  className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${service.color} hover:opacity-90 transition-all duration-300 hover:scale-105 text-white font-medium`}
                >
                  <span className="text-2xl">{service.icon}</span>
                  <span>{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
