import '../css/dist/output.css'
const emote = ['👺','💀','🎉','👾','🤖','🔥','🧠','🌿','🦾','🦊','✨','🏡','🐵','🦄','🀄','🌟','🖥','📟','👋','🧬','📖','🚀','👑','🌈','🌱','🌎']

const colour_map = [
     'bg-gradient-to-bl from-Retro-light-blue to-Retro-light-pink',
     'bg-gradient-to-bl from-Vapor-Violet to-Vapor-Orange',
     'bg-gradient-to-bl from-Retro-purple to-Vapor-Pink',
     'bg-gradient-to-bl from-Retro-purple to-Vapor-Blue',
     'bg-gradient-to-bl from-Retro-light-pink to-Vapor-Blue',
     'bg-gradient-to-bl from-indigo-500 via-purple-500 to-pink-500',
     'bg-gradient-to-bl from-Vapor-Rose to-Vapor-Blue',
     'bg-gradient-to-bl from-Warm-Blue via-Warm-Pink via-Warm-Red via-Warm-Orange to-Warm-Yellow',
     'bg-gradient-to-bl from-Happy-Yellow via-Happy-Tangerine via-Happy-Indego-Purple via-Cool-Blue to-Happy-Sea-Blue',
     'bg-gradient-to-bl from-Blue-Turquoise via-Blue-Midtone to-Blue-Royal',
     'bg-gradient-to-bl from-Green-Black via-Green-Forest to-Green-Emerald',
     'bg-gradient-to-bl from-Amethyst-Light to-Amethyst-Dark',
     'bg-gradient-to-bl from-Peach-Red to-Peach-Yello',
     'bg-gradient-to-bl from-Deep-Space-Black to-Deep-Space-Gray',
     'bg-gradient-to-bl from-Sunshine-Red to-Sunshine-Blue'
]

/**
 * Get a random emoji from emote array
 * @returns random emoji from emote array
 */
export const random_emoji = () =>{
    return emote[Math.floor(Math.random() * emote.length)]
}

/**
 * Get a random color string from colour_map array
 * @returns random color css string 
 */
export const random_colour = () => {
    return colour_map[Math.floor(Math.random() * colour_map.length)]
}


export const list_of_null = (idx) => {
    var list = []
    for(var i = 0; i < idx; i++ ) {
        list.push(null)
    }
    return list
}

/**
 * 
 * @returns 
 */
export const useThemeDetector = () => {
    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    return getCurrentTheme();
}