const messages = (user: string) => [
    `
Happy Birthday <@${user}>!

May this special day bring you lots of happiness, tons of pizza and thousands of nice wishes! Though I’m just a bot, my love to you is true and sincere.

All the best. We love you!`,
    `
Happy Birthday <@${user}>!

I’d like to wish you a stunning year! May all your dreams come true.

And remember: you don’t get old, you just get more awesome. Keep on rocking.
`,
];

const gifs = [
    "https://d31h9pijuvf29u.cloudfront.net/media/c_images/cdfe7b0a06.gif",
    "https://d31h9pijuvf29u.cloudfront.net/media/c_images/5ef31e0835.gif",
    "https://d31h9pijuvf29u.cloudfront.net/media/c_images/6734cb771b.gif",
    "https://d31h9pijuvf29u.cloudfront.net/media/c_images/afbb5274ba.gif",
];

const generateGif = () => gifs[Math.floor(Math.random() * gifs.length)];

export const generateAttachment = () => {
    const gif = generateGif();

    return {
        fallback: "Happy Birthday GIF!",
        image_url: gif,
        thumb_url: gif,
    };
};

export const generateMessage = (user: string) =>
    messages(user)[Math.floor(Math.random() * messages.length)];
