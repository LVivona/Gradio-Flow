import '../css/dist/output.css'
const emote = ['👺', '👾', '🤖', '🧠', '🦾', '🦊', '🐵', '🦄', '🀄' ,'🌟', '🖥', '📟', '🧬', '🚀', '🌈', '🌱', '🌎']

const colour_map = {
    0 : 'bg-gradient-to-bl from-Retro-light-blue to-Retro-light-pink',
    1 : 'bg-gradient-to-bl from-Vapor-Violet to-Vapor-Orange',
    2 : 'bg-gradient-to-bl from-Retro-purple to-Vapor-Pink',
    3 : 'bg-gradient-to-bl from-Retro-purple to-Vapor-Blue',
    4 : 'bg-gradient-to-bl from-Retro-light-pink to-Vapor-Blue',
    5 : 'bg-gradient-to-bl from-indigo-500 via-purple-500 to-pink-500',
    6 : 'bg-gradient-to-bl from-Vapor-Rose to-Vapor-Blue',
    7 : 'bg-gradient-to-bl from-Warm-Blue via-Warm-Pink via-Warm-Red via-Warm-Orange to-Warm-Yellow',
    8 : 'bg-gradient-to-bl from-Happy-Yellow via-Happy-Tangerine via-Happy-Light-Magenta via-Happy-Indego-Purple via-Cool-Blue to-Happy-Sea-Blue',
    9 : 'bg-gradient-to-bl from-Blue-Turquoise via-Blue-Midtone to-Blue-Royal',
    10 : 'bg-gradient-to-bl from-Green-Black via-Green-Forest to-Green-Emerald'
}

/**
 * 
 *  "Warm-Blue": "#283AB8",
        "Warm-Violet" : "#8D379E",
        "Warm-Pink" : "#F13484",
        "Warm-Red" : "#FF605D",
        "Warm-Orange" : "#FEA959",
        "Warm-Yellow" : "#FEE27A",
 */

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