import '../css/dist/output.css'
const emote = ['👺', '👾', '🤖', '🧠', '🦾', '🐲', '🦊', '🐵', '🦄', '🀄' ,'🌟', '🖥', '📟', '🧬', '🚀', '🌈', '🌱', '🌎']

const colour_map = {
    0 : 'bg-gradient-to-bl from-Retro-light-blue to-Retro-light-pink',
    1 : 'bg-gradient-to-bl from-Vapor-Violet to-Vapor-Orange',
    2 : 'bg-gradient-to-bl from-Retro-purple to-Vapor-Pink',
    3 : 'bg-gradient-to-bl from-Retro-purple to-Vapor-Blue',
    4 : 'bg-gradient-to-bl from-Retro-light-pink to-Vapor-Blue',
    5 : 'bg-gradient-to-bl from-Vapor-Orange to-Vapor-Violet',
    6 : 'bg-gradient-to-bl from-Vapor-Rose to-Vapor-Blue'
}

export const random_emoji = () =>{
    return emote[Math.floor(Math.random() * emote.length)]
}

export const random_colour = () => {
    return colour_map[Math.floor(Math.random() * Object.keys(colour_map).length)]
}

export const list_of_null = (idx) => {
    var list = []
    for(var i = 0; i < idx; i++ ) {
        list.push(null)
    }
    return list
}


export const useThemeDetector = () => {
    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    return getCurrentTheme;
}