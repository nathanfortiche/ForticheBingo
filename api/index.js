import express from 'express';
import cors from 'cors';
import OpenAI from "openai";
import { setupAuth } from '../server/auth.js';
import { db } from '../db/index.js';
import { personalResolutions } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.static('dist/public')); // Pour servir l'application React

// Configuration de l'authentification
setupAuth(app);

// Routes existantes de l'API météo
app.get('/', (req, res) => {
    res.send('Serveur opérationnel !');
});

let GPT4 = async (message) => {
    const { data, response } = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: message,
    }).withResponse();

    if (data && data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
    } else {
        throw new Error(`Réponse inattendue de l'API OpenAI. ${response.data}`);
    }
};

app.post('/getSuggestion', async (req, res) => {
    const { temperature, weatherCondition } = req.body;
    const GPT4Message = [
        { role: "system", content: "You are a monkey assistant named Toobo. You present the weather and speak like an 8-year-old child. Your answers are short and you recommend specific outfits, naming 3 to 4 clothing items/accessories. Be excited ! Only recommend hot weather clothes when it's 22 celcius and above, only recommend cold weather clothes when it's 10 celcius and below. You speak french" },
        { role: "user", content: `It's ${temperature} degrees celcius and the condition is ${weatherCondition}. How should I dress? Answer in French only. Answer specific clothing items. Be funny !` }
    ];

    try {
        const gptResponse = await GPT4(GPT4Message);
        res.json({ suggestion: gptResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/weather', (req, res) => {
    const location = req.query.location;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=fr&appid=${process.env.API_KEY}`
    console.log(
        `Location searched: ${location}. Url: ${url}`
    );

    return fetch(url)
        .then(result => result.json())
        .then(data => {
            res.json(data);
        });
});

// Nouvelles routes pour le bingo
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Not authenticated" });
};

// Get personal resolutions (public route)
app.get("/api/personal-resolutions", async (_req, res) => {
    try {
        const resolutions = await db.query.personalResolutions.findMany({
            orderBy: (personalResolutions, { asc }) => [asc(personalResolutions.position)],
        });
        res.json(resolutions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching resolutions" });
    }
});

// Update resolution text and status (protected route)
app.put("/api/personal-resolutions/:id", isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { status, text } = req.body;

    try {
        await db
            .update(personalResolutions)
            .set({ 
                ...(status && { status }),
                ...(text && { text }),
                updatedAt: new Date(),
            })
            .where(eq(personalResolutions.id, parseInt(id)));

        res.json({ message: "Updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error updating" });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`API server started on http://localhost:${PORT}`);
});
