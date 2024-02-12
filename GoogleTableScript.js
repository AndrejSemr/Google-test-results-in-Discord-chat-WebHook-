function onFormSubmit(e) {

  const MINIMUMTESTTARGET = 45; // Minimum score to pass the test
  const WEBHOOKLINK = '<webhook link>'

  const COLOR_FOR_POSITIVE_RESULT = 3381555;
  const COLOR_FOR_NEGATIVE_RESULT = 11340304;

  // Get form fields from Event
  let submittedData = e.namedValues;

  let webhookBody = CreateContent(submittedData,MINIMUMTESTTARGET);
  Logger.log(webhookBody);

  SendWebhookRequest(WEBHOOKLINK,webhookBody);

}

// Function to create a body of a webhook. You can prepare content here - https://discohook.org/
// GET: submittedData - Form details
// GET: MINIMUMTESTTARGET - Minimum score to pass the test
// RETURN: JSON object with content
function CreateContent(submittedData,MINIMUMTESTTARGET){


  let score = submittedData['Баллы'][0]; // "Result" field name
  let testScoreAsNumber = Number(score.split('/')[0]);
  let statusImage = (testScoreAsNumber >= MINIMUMTESTTARGET)? ':white_check_mark:' : ':x:' ;
  let statusEmbedsColor = (testScoreAsNumber >=MINIMUMTESTTARGET)? COLOR_FOR_POSITIVE_RESULT : COLOR_FOR_NEGATIVE_RESULT; // Green : Red
  
  // Message outside of 'Embed'. As standard discord text.
  let massage = "Новый результат экзамена по ПМП"

  // Title of embed
  let embedsTitle= "Экзамен по ПМП: " + submittedData['Ваш игровой никнейм?'];

  // Embed body content (\n line separator)
    let embedsDesctiption = `Пользователь: ${submittedData['Ваш игровой никнейм?']}\n
Результат: ${submittedData['Баллы']}\n
Статус: ${statusImage}\n
Дата экзамена: ${submittedData['Отметка времени']}\n`;


  if(testScoreAsNumber >= MINIMUMTESTTARGET){
    embedsDesctiption += "\n \n :arrow_right:  "+ submittedData['Ваш игровой никнейм?'] +", пожалуйста обратитесь к 11+ рангу для прохождения практического экзамена.";
  }

  let webhookBody = {
    "content": massage,
    "embeds": [
      {
        "title": embedsTitle,
        "description": embedsDesctiption,
        "color": statusEmbedsColor
      }
    ],
    "attachments": []
  }

  return webhookBody
}

// Function for sending a request to WebHook
// GET webhook link, content to be displayed
function SendWebhookRequest(WEBHOOKLINK,webhookBody){
  try {
    let options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(webhookBody),
    };

    let response = UrlFetchApp.fetch(WEBHOOKLINK, options);
    
    Logger.log('Webhook response: ' + response.getContentText());
  } catch (error) {
    Logger.log('Error sending webhook: ' + error);
  }
}
