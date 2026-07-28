window.CHALLENGE_DATA = {
  "title": "Musculoskeletal Terminology Challenge",
  "subtitle": "Test what you know, decode medical language, and practice explaining SOAP terms.",
  "rounds": [
    {
      "id": "quick-pick",
      "number": 1,
      "title": "Quick Pick",
      "label": "Recognition",
      "description": "Choose the best answer. Terms from all five videos are mixed together.",
      "questions": [
        {
          "id": "qp-purpose",
          "prompt": "Which statement best summarizes the two basic purposes of the musculoskeletal system?",
          "options": [
            "Produce hormones and digest nutrients",
            "Provide shape and support and allow movement",
            "Exchange gases and remove waste",
            "Control body temperature and blood pressure"
          ],
          "answer": "Provide shape and support and allow movement",
          "hint": "Think about what the skeleton contributes and what muscles make possible.",
          "explanation": "The skeleton provides shape and support, while muscles produce force and create movement."
        },
        {
          "id": "qp-root-joint",
          "prompt": "Which word root means <strong>joint</strong>?",
          "options": [
            "oste/o",
            "arthr/o",
            "my/o",
            "ten/o"
          ],
          "answer": "arthr/o",
          "hint": "You can hear this root in <em>arthritis</em> and <em>arthroscopy</em>.",
          "explanation": "<strong>arthr/o</strong> means joint. Oste/o means bone, my/o means muscle, and ten/o means tendon."
        },
        {
          "id": "qp-subjective",
          "prompt": "Which statement best describes information in the <strong>Subjective</strong> section of a SOAP note?",
          "options": [
            "Symptoms and experiences reported by the patient",
            "Findings observed or measured by the practitioner",
            "The provider’s diagnosis",
            "The treatment recommended by the provider"
          ],
          "answer": "Symptoms and experiences reported by the patient",
          "hint": "Ask yourself who supplies this information—the patient or the practitioner.",
          "explanation": "Subjective information is what the patient reports feeling or experiencing."
        },
        {
          "id": "qp-mri",
          "prompt": "Which imaging procedure is especially useful for viewing soft tissues such as muscles, tendons, and ligaments?",
          "options": [
            "X-ray",
            "MRI",
            "Electromyography",
            "Arthrodesis"
          ],
          "answer": "MRI",
          "hint": "This procedure uses a strong magnetic field to create images.",
          "explanation": "MRI stands for magnetic resonance imaging and is especially useful for viewing soft tissue."
        },
        {
          "id": "qp-analgesic",
          "prompt": "Which medication class is used primarily to relieve pain?",
          "options": [
            "Analgesic",
            "Antipyretic",
            "Orthotic",
            "Antiarthritic"
          ],
          "answer": "Analgesic",
          "hint": "The lecture describes acetaminophen as an example of this class.",
          "explanation": "Analgesics are pain medications. Anti-inflammatory medications target inflammation and swelling."
        }
      ]
    },
    {
      "id": "crack-the-code",
      "number": 2,
      "title": "Crack the Code",
      "label": "Decoding",
      "description": "Use the word parts and context to identify the meaning of the underlined term.",
      "questions": [
        {
          "id": "cc-tarsalgia",
          "prompt": "After twisting her ankle, Maya reports <u>tarsalgia</u>. What does the underlined term mean?",
          "options": [
            "Pain in the ankle",
            "Pain in a tendon",
            "Stiffness in a joint",
            "Pain in the lower back"
          ],
          "answer": "Pain in the ankle",
          "hint": "Break it apart: <strong>tars/o</strong> + <strong>-algia</strong>.",
          "explanation": "Tars/o means ankle, and -algia means pain. Tarsalgia means pain in the ankle."
        },
        {
          "id": "cc-myalgia",
          "prompt": "After an intense workout, Jordan complains of <u>myalgia</u>. What does the underlined term mean?",
          "options": [
            "Muscle pain",
            "Bone pain",
            "Joint pain",
            "Tendon inflammation"
          ],
          "answer": "Muscle pain",
          "hint": "The root <strong>my/o</strong> identifies the affected structure.",
          "explanation": "My/o means muscle, and -algia means pain. Myalgia means muscle pain."
        },
        {
          "id": "cc-bradykinesia",
          "prompt": "A patient with <u>bradykinesia</u> can still move voluntarily, but every movement is unusually slow. What does the term mean?",
          "options": [
            "Slow movement",
            "Poor coordination",
            "Increased muscle tone",
            "Muscle weakness"
          ],
          "answer": "Slow movement",
          "hint": "<strong>brady-</strong> means slow, and <strong>kinesi/o</strong> refers to movement.",
          "explanation": "Bradykinesia is a general term for abnormally slow movement."
        },
        {
          "id": "cc-osteopenia",
          "prompt": "The assessment notes <u>osteopenia</u>. What does the underlined term mean?",
          "options": [
            "Reduced bone volume",
            "Inflammation of a joint",
            "A cancerous bone tumor",
            "Abnormal narrowing of the spine"
          ],
          "answer": "Reduced bone volume",
          "hint": "The root <strong>oste/o</strong> means bone. The ending suggests a deficiency or reduction.",
          "explanation": "Osteopenia is a reduction in bone volume and may progress to osteoporosis."
        },
        {
          "id": "cc-arthrodesis",
          "prompt": "The plan recommends <u>arthrodesis</u> for a painful, unstable joint. What does the underlined term mean?",
          "options": [
            "Surgical immobilization of a joint by fusion",
            "Surgical reconstruction of a joint",
            "Visual examination of a joint",
            "Partial dislocation of a joint"
          ],
          "answer": "Surgical immobilization of a joint by fusion",
          "hint": "<strong>arthr/o</strong> means joint. The procedure prevents the joint from moving.",
          "explanation": "Arthrodesis is surgical immobilization of a joint by fusing adjacent bones."
        }
      ]
    },
    {
      "id": "make-the-call",
      "number": 3,
      "title": "Make the Call",
      "label": "Application",
      "description": "Read each situation and choose the medical term that fits best.",
      "questions": [
        {
          "id": "mc-crepitus",
          "prompt": "A student says, “My knee makes a crackling sound whenever I bend it.” Which term best describes the complaint?",
          "options": [
            "Ankylosis",
            "Crepitus",
            "Myasthenia",
            "Hypertonia"
          ],
          "answer": "Crepitus",
          "hint": "Focus on the sound the patient reports when the joint moves.",
          "explanation": "Crepitus is a crackling sound associated with bending or moving a joint."
        },
        {
          "id": "mc-hypotonia",
          "prompt": "During an examination, a patient’s muscles have unusually low tone, and the movements appear floppy and weak. Which term fits best?",
          "options": [
            "Hypotonia",
            "Hypertonia",
            "Ataxia",
            "Hypertrophy"
          ],
          "answer": "Hypotonia",
          "hint": "The prefix <strong>hypo-</strong> means below normal or decreased.",
          "explanation": "Hypotonia is decreased muscle tone or tension and can make movement appear floppy or less forceful."
        },
        {
          "id": "mc-spiral-fracture",
          "prompt": "A soccer player’s cleated foot stays planted while the rest of the body twists. Imaging shows a fracture line wrapping around the bone. What type of fracture is most likely?",
          "options": [
            "Transverse fracture",
            "Spiral fracture",
            "Angulated fracture",
            "Compression fracture"
          ],
          "answer": "Spiral fracture",
          "hint": "The injury involves a twisting or torsion force.",
          "explanation": "Spiral fractures are commonly associated with twisting injuries."
        },
        {
          "id": "mc-subluxation",
          "prompt": "Imaging shows that a shoulder joint is partly out of its normal position, but it is not completely dislocated. Which diagnosis fits best?",
          "options": [
            "Subluxation",
            "Ankylosis",
            "Scoliosis",
            "Osteopenia"
          ],
          "answer": "Subluxation",
          "hint": "The key clue is <strong>partly</strong> out of position.",
          "explanation": "A subluxation is a partial dislocation of a joint."
        },
        {
          "id": "mc-closed-reduction",
          "prompt": "A clinician manually realigns a broken bone without performing surgery. Which procedure was used?",
          "options": [
            "Closed reduction",
            "Open reduction",
            "Arthroplasty",
            "Osteectomy"
          ],
          "answer": "Closed reduction",
          "hint": "The bone is realigned, but the procedure does not involve surgery.",
          "explanation": "Closed reduction realigns broken bones without surgery. Open reduction is surgical."
        },
        {
          "id": "mc-orthotic",
          "prompt": "A student wears a device that supports and stabilizes an existing body part. It does not replace a missing body part. What is the device?",
          "options": [
            "Orthotic",
            "Prosthesis",
            "Internal fixation",
            "Analgesic"
          ],
          "answer": "Orthotic",
          "hint": "Distinguish between supporting an existing body part and replacing a missing one.",
          "explanation": "An orthotic supports, stabilizes, strengthens, or helps position a body part. A prosthesis replaces a missing body part."
        }
      ]
    }
  ],
  "oralItems": [
    {
      "id": "oral-subjective",
      "category": "Subjective",
      "term": "Crepitus",
      "audio": "assets/audio/subjective-crepitus.mp3",
      "prompt": "Explain what <strong>crepitus</strong> means, why it may appear in the Subjective section, and give an example of what a patient might say.",
      "model": "Crepitus is a crackling sound or sensation associated with movement of a joint. It may appear in the Subjective section when a patient reports hearing or feeling the crackling. Example: “My knee crackles whenever I bend it.”"
    },
    {
      "id": "oral-objective",
      "category": "Objective",
      "term": "Spiral fracture",
      "audio": "assets/audio/objective-spiral-fracture.mp3",
      "prompt": "Explain what a <strong>spiral fracture</strong> is, why it may appear in the Objective section, and describe how a practitioner might discover it.",
      "model": "A spiral fracture has a fracture line that twists around the bone and is often caused by a twisting force. It may appear in the Objective section because a practitioner can identify it through imaging such as an X-ray."
    },
    {
      "id": "oral-assessment",
      "category": "Assessment",
      "term": "Subluxation",
      "audio": "assets/audio/assessment-subluxation.mp3",
      "prompt": "Explain what <strong>subluxation</strong> means, why it belongs in the Assessment section, and give a brief diagnostic example.",
      "model": "A subluxation is a partial dislocation of a joint. It belongs in the Assessment section because it is a diagnosis based on the patient’s reported symptoms and the practitioner’s findings."
    },
    {
      "id": "oral-plan",
      "category": "Plan",
      "term": "Closed reduction",
      "audio": "assets/audio/plan-closed-reduction.mp3",
      "prompt": "Explain what <strong>closed reduction</strong> means, why it belongs in the Plan section, and describe when it might be used.",
      "model": "Closed reduction is the realignment of a broken bone without surgery. It belongs in the Plan section because it is a treatment procedure used to correct a fracture."
    }
  ]
};
