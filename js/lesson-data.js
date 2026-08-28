/* English Adventure — built-in demonstration lesson.
   This object mirrors data/example-lesson.json exactly. Embedding it as a
   script means the demo lesson plays even from file:// where fetch() of
   JSON is blocked by browser security. */

window.EA = window.EA || {};
EA.builtInLessons = [
{
  "id": "hello-goodbye-001",
  "version": 1,
  "schemaVersion": 1,
  "title": "Demo: Hello and Goodbye",
  "titleCs": "Pozdravy a loučení",
  "topic": "Greetings",
  "description": "Practise saying hello, asking names and saying goodbye.",
  "descriptionCs": "Procvič si pozdravy, jména a loučení.",
  "difficulty": 1,
  "ageRange": "8-9",
  "languageVariant": "en-GB",
  "thumbnail": "svg:meeting",
  "mascot": "mouse",
  "learningObjectives": [
    "Recognise hello and goodbye",
    "Ask What's your name?",
    "Answer My name's..."
  ],
  "targetVocabulary": ["hello", "hi", "goodbye", "bye", "name"],
  "targetPhrases": ["What's your name?", "My name's Anna.", "Hi, Anna.", "Goodbye!"],
  "games": {
    "pictureMatch": {
      "enabled": true,
      "rounds": [
        {
          "id": "pm-r1",
          "instruction": "Match the words to the pictures.",
          "instructionCs": "Přiřaď slova k obrázkům.",
          "items": [
            { "answer": "Hello!", "image": "svg:meeting", "alt": "Two children meeting and waving to each other" },
            { "answer": "Goodbye!", "image": "svg:leaving", "alt": "A child walking away and waving back" },
            { "answer": "My name's Anna.", "image": "svg:introduce-girl", "alt": "A girl pointing to herself" },
            { "answer": "Hi!", "image": "svg:wave-boy", "alt": "A boy waving happily" }
          ]
        },
        {
          "id": "pm-r2",
          "instruction": "Match the words to the pictures.",
          "instructionCs": "Přiřaď slova k obrázkům.",
          "items": [
            { "answer": "Hello!", "image": "svg:meeting2", "alt": "Two children meeting and saying hello" },
            { "answer": "Bye!", "image": "svg:leaving-girl", "alt": "A girl walking away while a boy waves" },
            { "answer": "My name's Max.", "image": "svg:introduce-boy", "alt": "A boy pointing to himself" },
            { "answer": "Hi!", "image": "svg:wave-girl", "alt": "A girl waving happily" },
            { "answer": "Goodbye!", "image": "svg:leaving2", "alt": "A child leaving and waving back" }
          ]
        },
        {
          "id": "pm-r3",
          "instruction": "Match the phrases to the pictures.",
          "instructionCs": "Přiřaď věty k obrázkům.",
          "items": [
            { "answer": "What's your name?", "image": "svg:question", "alt": "A boy asking a girl a question" },
            { "answer": "My name's Lucy.", "image": "svg:introduce-girl2", "alt": "A girl with fair hair pointing to herself" },
            { "answer": "Hi, Tom!", "image": "svg:wave-boy2", "alt": "A boy with dark hair waving" },
            { "answer": "Goodbye, Eva!", "image": "svg:leaving", "alt": "A boy leaving while a girl watches" }
          ]
        }
      ]
    },
    "sentenceTrain": {
      "enabled": true,
      "contractions": { "What's": "What is", "name's": "name is" },
      "items": [
        {
          "id": "st-01", "level": 1,
          "prompt": "Ask the girl her name.",
          "promptCs": "Zeptej se dívky na jméno.",
          "image": "svg:question",
          "answer": ["What's", "your", "name?"],
          "distractors": []
        },
        {
          "id": "st-02", "level": 1,
          "prompt": "The boy says his name.",
          "promptCs": "Chlapec říká své jméno.",
          "image": "svg:introduce-boy2",
          "answer": ["My", "name's", "Tom."],
          "distractors": []
        },
        {
          "id": "st-03", "level": 2,
          "prompt": "Say hello to Anna.",
          "promptCs": "Pozdrav Annu.",
          "image": "svg:wave-girl",
          "answer": ["Hello,", "Anna!"],
          "distractors": ["Goodbye,"]
        },
        {
          "id": "st-04", "level": 2,
          "prompt": "Say goodbye to Lucy.",
          "promptCs": "Rozluč se s Lucy.",
          "image": "svg:leaving-girl",
          "answer": ["Goodbye,", "Lucy!"],
          "distractors": ["Hello,"]
        },
        {
          "id": "st-05", "level": 2,
          "prompt": "The girl says her name.",
          "promptCs": "Dívka říká své jméno.",
          "image": "svg:introduce-girl",
          "answer": ["My", "name's", "Anna."],
          "distractors": ["goodbye"]
        },
        {
          "id": "st-06", "level": 3,
          "prompt": "Ask the boy his name.",
          "promptCs": "Zeptej se chlapce na jméno.",
          "image": "svg:question2",
          "answer": ["What's", "your", "name?"],
          "distractors": ["book", "hello"]
        }
      ]
    },
    "wordMatch": {
      "enabled": true,
      "rounds": [
        {
          "id": "wm-r1",
          "instruction": "Match the English and Czech words.",
          "instructionCs": "Spoj anglická a česká slova.",
          "pairs": [
            { "en": "hello", "cs": "ahoj" },
            { "en": "goodbye", "cs": "na shledanou" },
            { "en": "bye", "cs": "pa pa" },
            { "en": "name", "cs": "jméno" },
            { "en": "my", "cs": "můj" },
            { "en": "your", "cs": "tvůj" },
            { "en": "boy", "cs": "chlapec" },
            { "en": "girl", "cs": "dívka" }
          ]
        }
      ]
    },
    "conversationComic": {
      "enabled": true,
      "setting": "school-playground",
      "characters": [
        { "id": "anna", "name": "Anna" },
        { "id": "max", "name": "Max" }
      ],
      "scenes": [
        {
          "speaker": "anna", "text": "Hello!",
          "responseSpeaker": "max",
          "options": ["Hi!", "Goodbye!", "A red pencil."],
          "answer": "Hi!"
        },
        {
          "speaker": "anna", "text": "What's your name?",
          "responseSpeaker": "max",
          "options": ["My name's Max.", "I'm a book.", "Bye!"],
          "answer": "My name's Max."
        },
        {
          "speaker": "max", "text": "And what's your name?",
          "responseSpeaker": "anna",
          "options": ["My name's Anna.", "A blue bag.", "Hello, hello!"],
          "answer": "My name's Anna."
        },
        {
          "speaker": "max", "text": "How are you, Anna?",
          "responseSpeaker": "anna",
          "options": ["I'm fine, thank you.", "My name's Anna.", "Goodbye."],
          "answer": "I'm fine, thank you."
        },
        {
          "speaker": "anna", "text": "Goodbye, Max!",
          "responseSpeaker": "max",
          "options": ["Bye, Anna!", "What's your name?", "A pencil."],
          "answer": "Bye, Anna!"
        }
      ]
    },
    "listenAndChoose": {
      "enabled": true,
      "items": [
        {
          "id": "lc-01", "type": "picture", "audio": "Goodbye!",
          "options": [
            { "image": "svg:leaving", "alt": "A child walking away and waving back" },
            { "image": "svg:meeting", "alt": "Two children meeting and waving" },
            { "image": "svg:introduce-girl", "alt": "A girl pointing to herself" }
          ],
          "answerIndex": 0
        },
        {
          "id": "lc-02", "type": "phrase", "audio": "What's your name?",
          "options": ["What's your name?", "My name's Anna.", "Goodbye!"],
          "answerIndex": 0
        },
        {
          "id": "lc-03", "type": "response", "audio": "Hello!",
          "prompt": "Choose the best answer.",
          "promptCs": "Vyber nejlepší odpověď.",
          "options": ["Hi!", "Blue.", "My pencil."],
          "answerIndex": 0
        },
        {
          "id": "lc-04", "type": "gap", "audio": "My name's Tom.",
          "display": "My _____ Tom.",
          "options": ["name's", "goodbye", "hello"],
          "answerIndex": 0
        },
        {
          "id": "lc-05", "type": "picture", "audio": "Hello!",
          "options": [
            { "image": "svg:meeting2", "alt": "Two children meeting and saying hello" },
            { "image": "svg:leaving-girl", "alt": "A girl walking away" },
            { "image": "svg:question", "alt": "A boy asking a question" }
          ],
          "answerIndex": 0
        },
        {
          "id": "lc-06", "type": "phrase", "audio": "My name's Lucy.",
          "options": ["My name's Lucy.", "What's your name?", "Bye, Lucy!"],
          "answerIndex": 0
        },
        {
          "id": "lc-07", "type": "response", "audio": "What's your name?",
          "prompt": "Choose the best answer.",
          "promptCs": "Vyber nejlepší odpověď.",
          "options": ["My name's Ben.", "I'm fine.", "Goodbye!"],
          "answerIndex": 0
        },
        {
          "id": "lc-08", "type": "gap", "audio": "Goodbye, Eva!",
          "display": "_____, Eva!",
          "options": ["Goodbye", "Hello", "Name"],
          "answerIndex": 0
        }
      ]
    }
  }
}
];
