const { GoogleGenerativeAI } = require('@google/generative-ai');

const generateAIMessage = async (patient) => {
  const apiKey = process.env.GEMINI_API_KEY;

  // If no API key, use mock response
  if (!apiKey || apiKey.trim() === '') {
    return generateMockMessage(patient);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a friendly, professional, and polite WhatsApp follow-up message for a patient.

Patient Details:
- Name: ${patient.name}
- Consultation Date: ${patient.consultation_date}
- Follow-up Date: ${patient.follow_up_date}

Requirements:
- The message should be warm and professional
- It should remind them about their follow-up consultation
- Include a friendly greeting
- Ask them to confirm their appointment
- Keep it concise and appropriate for WhatsApp
- Sign off as "EPIA Healthcare Team"

Generate only the message text, no additional explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const message = response.text();

    return message.trim();
  } catch (error) {
    console.error('Gemini API error:', error.message);
    // Fallback to mock message if API fails
    return generateMockMessage(patient);
  }
};

const generateMockMessage = (patient) => {
  const messages = [
    `Hello ${patient.name}, this is a friendly reminder from EPIA. We hope you are doing well. Your follow-up consultation is scheduled for today. Please let us know if you would like to confirm your appointment. Thank you!`,
    
    `Dear ${patient.name}, greetings from EPIA Healthcare Team! This is a gentle reminder about your follow-up appointment scheduled for today. We hope you're recovering well. Please confirm if you'll be attending. Best regards!`,
    
    `Hi ${patient.name}, EPIA Healthcare here! Just a quick reminder about your follow-up consultation today. We care about your health and want to ensure you're on track with your treatment. Please let us know if you can make it. Thank you!`,
    
    `Good day ${patient.name}! This is EPIA following up on your consultation. Your follow-up appointment is today. We're looking forward to seeing you and checking on your progress. Please confirm your attendance. Take care!`
  ];

  // Return a random message
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

module.exports = { generateAIMessage };
