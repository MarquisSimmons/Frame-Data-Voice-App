const Alexa = require('ask-sdk');
const fs = require('fs');

const invocationName = 'frame data';

// 1. Intent Handlers =============================================

const AMAZON_CancelIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Okay, talk to you later! ';

		return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
	},
};

const AMAZON_HelpIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let intents = getCustomIntents();
		let sampleIntent = randomElement(intents);

		let say = 'You asked for help. ';

		// let previousIntent = getPreviousIntent(sessionAttributes);
		// if (previousIntent && !handlerInput.requestEnvelope.session.new) {
		//     say += 'Your last intent was ' + previousIntent + '. ';
		// }
		// say +=  'I understand  ' + intents.length + ' intents, '

		say += ' Here something you can ask me, ' + getSampleUtterance(sampleIntent);

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const AMAZON_StopIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Okay, talk to you later! ';

		return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
	},
};

const HelloWorldIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'HelloWorldIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Hello from HelloWorldIntent. ';

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const AMAZON_NavigateHomeIntent_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		let say = 'Hello from AMAZON.NavigateHomeIntent. ';

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const GetSpecialMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetSpecialMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}

		let say = 'Hello from GetSpecialMoveFrames. ';

		let slotStatus = '';
		let resolvedSlot;

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.heardAs) {
			slotStatus += ' slot Character was heard as ' + slotValues.Character.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Character is empty. ';
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Character.resolved !== slotValues.Character.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Character.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
		}

		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Character.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'Character'), 'or');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.heardAs) {
			slotStatus += ' slot VSystem was heard as ' + slotValues.VSystem.heardAs + '. ';
		}
		else {
			slotStatus += 'slot VSystem is empty. ';
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.VSystem.resolved !== slotValues.VSystem.heardAs) {
				slotStatus += 'synonym for ' + slotValues.VSystem.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.VSystem.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'VSystem'), 'or');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.heardAs) {
			slotStatus += ' slot FrameType was heard as ' + slotValues.FrameType.heardAs + '. ';
		}
		else {
			slotStatus += 'slot FrameType is empty. ';
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.FrameType.resolved !== slotValues.FrameType.heardAs) {
				slotStatus += 'synonym for ' + slotValues.FrameType.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}

		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.FrameType.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'FrameType'), 'or');
		}
		//   SLOT: MoveStrength
		if (slotValues.MoveStrength.heardAs) {
			slotStatus += ' slot MoveStrength was heard as ' + slotValues.MoveStrength.heardAs + '. ';
		}
		else {
			slotStatus += 'slot MoveStrength is empty. ';
		}
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.MoveStrength.resolved !== slotValues.MoveStrength.heardAs) {
				slotStatus += 'synonym for ' + slotValues.MoveStrength.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.MoveStrength.heardAs + '" to the custom slot type used by slot MoveStrength! ');
		}

		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.MoveStrength.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'MoveStrength'), 'or');
		}
		//   SLOT: SpecialMove
		if (slotValues.SpecialMove.heardAs) {
			slotStatus += ' slot SpecialMove was heard as ' + slotValues.SpecialMove.heardAs + '. ';
		}
		else {
			slotStatus += 'slot SpecialMove is empty. ';
		}
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.SpecialMove.resolved !== slotValues.SpecialMove.heardAs) {
				slotStatus += 'synonym for ' + slotValues.SpecialMove.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.SpecialMove.heardAs + '" to the custom slot type used by slot SpecialMove! ');
		}

		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.SpecialMove.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'SpecialMove'), 'or');
		}
		say += slotStatus;

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const GetNormalMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetNormalMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}

		let say = 'Hello from GetNormalMoveFrames. ';

		let slotStatus = '';
		let resolvedSlot;

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.heardAs) {
			slotStatus += ' slot Character was heard as ' + slotValues.Character.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Character is empty. ';
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Character.resolved !== slotValues.Character.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Character.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
		}

		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Character.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'Character'), 'or');
		}
		//   SLOT: Position
		if (slotValues.Position.heardAs) {
			slotStatus += ' slot Position was heard as ' + slotValues.Position.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Position is empty. ';
		}
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Position.resolved !== slotValues.Position.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Position.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Position.heardAs + '" to the custom slot type used by slot Position! ');
		}

		if (slotValues.Position.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Position.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'Position'), 'or');
		}
		//   SLOT: NormalMove
		if (slotValues.NormalMove.heardAs) {
			slotStatus += ' slot NormalMove was heard as ' + slotValues.NormalMove.heardAs + '. ';
		}
		else {
			slotStatus += 'slot NormalMove is empty. ';
		}
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.NormalMove.resolved !== slotValues.NormalMove.heardAs) {
				slotStatus += 'synonym for ' + slotValues.NormalMove.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.NormalMove.heardAs + '" to the custom slot type used by slot NormalMove! ');
		}

		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.NormalMove.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'NormalMove'), 'or');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.heardAs) {
			slotStatus += ' slot FrameType was heard as ' + slotValues.FrameType.heardAs + '. ';
		}
		else {
			slotStatus += 'slot FrameType is empty. ';
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.FrameType.resolved !== slotValues.FrameType.heardAs) {
				slotStatus += 'synonym for ' + slotValues.FrameType.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}

		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.FrameType.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'FrameType'), 'or');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.heardAs) {
			slotStatus += ' slot VSystem was heard as ' + slotValues.VSystem.heardAs + '. ';
		}
		else {
			slotStatus += 'slot VSystem is empty. ';
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.VSystem.resolved !== slotValues.VSystem.heardAs) {
				slotStatus += 'synonym for ' + slotValues.VSystem.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.VSystem.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'VSystem'), 'or');
		}
		//   SLOT: Item
		if (slotValues.Item.heardAs) {
			slotStatus += ' slot Item was heard as ' + slotValues.Item.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Item is empty. ';
		}
		if (slotValues.Item.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Item.resolved !== slotValues.Item.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Item.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Item.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Item.heardAs + '" to the custom slot type used by slot Item! ');
		}

		if (slotValues.Item.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Item.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetNormalMoveFrames', 'Item'), 'or');
		}

		say += slotStatus;

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const GetVSystemMoveFrames_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'IntentRequest' && request.intent.name === 'GetVSystemMoveFrames';
	},
	handle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		const responseBuilder = handlerInput.responseBuilder;
		let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

		// delegate to Alexa to collect all the required slots
		const currentIntent = request.intent;
		if (request.dialogState && request.dialogState !== 'COMPLETED') {
			return handlerInput.responseBuilder.addDelegateDirective(currentIntent).getResponse();
		}

		let say = 'Hello from GetVSystemMoveFrames. ';

		let slotStatus = '';
		let resolvedSlot;

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.heardAs) {
			slotStatus += ' slot Character was heard as ' + slotValues.Character.heardAs + '. ';
		}
		else {
			slotStatus += 'slot Character is empty. ';
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.Character.resolved !== slotValues.Character.heardAs) {
				slotStatus += 'synonym for ' + slotValues.Character.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
		}

		if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.Character.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'Character'), 'or');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.heardAs) {
			slotStatus += ' slot VSystem was heard as ' + slotValues.VSystem.heardAs + '. ';
		}
		else {
			slotStatus += 'slot VSystem is empty. ';
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.VSystem.resolved !== slotValues.VSystem.heardAs) {
				slotStatus += 'synonym for ' + slotValues.VSystem.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.VSystem.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'VSystem'), 'or');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.heardAs) {
			slotStatus += ' slot FrameType was heard as ' + slotValues.FrameType.heardAs + '. ';
		}
		else {
			slotStatus += 'slot FrameType is empty. ';
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			slotStatus += 'a valid ';
			if (slotValues.FrameType.resolved !== slotValues.FrameType.heardAs) {
				slotStatus += 'synonym for ' + slotValues.FrameType.resolved + '. ';
			}
			else {
				slotStatus += 'match. ';
			} // else {
			//
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}

		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.FrameType.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'FrameType'), 'or');
		}

		say += slotStatus;

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const LaunchRequest_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const responseBuilder = handlerInput.responseBuilder;

		let say = 'hello' + ' and welcome to ' + invocationName + ' ! Say help to hear some options.';

		let skillTitle = capitalize(invocationName);

		return responseBuilder.speak(say).reprompt('try again, ' + say).getResponse();
	},
};

const SessionEndedHandler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'SessionEndedRequest';
	},
	handle(handlerInput) {
		console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
		return handlerInput.responseBuilder.getResponse();
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		const request = handlerInput.requestEnvelope.request;

		console.log(`Error handled: ${error.message}`);
		// console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);

		return handlerInput.responseBuilder
			.speak('Sorry, an error occurred.  Please say again.')
			.reprompt('Sorry, an error occurred.  Please say again.')
			.getResponse();
	},
};

// 2. Constants ===========================================================================

// Here you can define static data, to be used elsewhere in your code.  For example:
//    const myString = "Hello World";
//    const myArray  = [ "orange", "grape", "strawberry" ];
//    const myObject = { "city": "Boston",  "state":"Massachusetts" };

const APP_ID = undefined; // TODO replace with your Skill ID (OPTIONAL).

// 3.  Helper Functions ===================================================================

function capitalize(myString) {
	return myString.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
}

function randomElement(myArray) {
	return myArray[Math.floor(Math.random() * myArray.length)];
}

function stripSpeak(str) {
	return str.replace('<speak>', '').replace('</speak>', '');
}

function getSlotValues(filledSlots) {
	const slotValues = {};

	Object.keys(filledSlots).forEach((item) => {
		const name = filledSlots[item].name;

		if (
			filledSlots[item] &&
			filledSlots[item].resolutions &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
			filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code
		) {
			switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
				case 'ER_SUCCESS_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
						ERstatus: 'ER_SUCCESS_MATCH',
					};
					break;
				case 'ER_SUCCESS_NO_MATCH':
					slotValues[name] = {
						heardAs: filledSlots[item].value,
						resolved: '',
						ERstatus: 'ER_SUCCESS_NO_MATCH',
					};
					break;
				default:
					break;
			}
		}
		else {
			slotValues[name] = {
				heardAs: filledSlots[item].value,
				resolved: '',
				ERstatus: '',
			};
		}
	}, this);

	return slotValues;
}

function getExampleSlotValues(intentName, slotName) {
	let examples = [];
	let slotType = '';
	let slotValuesFull = [];

	let intents = model.interactionModel.languageModel.intents;
	for (let i = 0; i < intents.length; i++) {
		if (intents[i].name == intentName) {
			let slots = intents[i].slots;
			for (let j = 0; j < slots.length; j++) {
				if (slots[j].name === slotName) {
					slotType = slots[j].type;
				}
			}
		}
	}
	let types = model.interactionModel.languageModel.types;
	for (let i = 0; i < types.length; i++) {
		if (types[i].name === slotType) {
			slotValuesFull = types[i].values;
		}
	}

	examples.push(slotValuesFull[0].name.value);
	examples.push(slotValuesFull[1].name.value);
	if (slotValuesFull.length > 2) {
		examples.push(slotValuesFull[2].name.value);
	}

	return examples;
}

function sayArray(myData, penultimateWord = 'and') {
	let result = '';

	myData.forEach(function(element, index, arr) {
		if (index === 0) {
			result = element;
		}
		else if (index === myData.length - 1) {
			result += ` ${penultimateWord} ${element}`;
		}
		else {
			result += `, ${element}`;
		}
	});
	return result;
}

function getCustomIntents() {
	const modelIntents = model.interactionModel.languageModel.intents;

	let customIntents = [];

	for (let i = 0; i < modelIntents.length; i++) {
		if (modelIntents[i].name.substring(0, 7) != 'AMAZON.' && modelIntents[i].name !== 'LaunchRequest') {
			customIntents.push(modelIntents[i]);
		}
	}
	return customIntents;
}

function getSampleUtterance(intent) {
	return randomElement(intent.samples);
}

function getPreviousIntent(attrs) {
	if (attrs.history && attrs.history.length > 1) {
		return attrs.history[attrs.history.length - 2].IntentRequest;
	}
	else {
		return false;
	}
}

function getPreviousSpeechOutput(attrs) {
	if (attrs.lastSpeechOutput && attrs.history.length > 1) {
		return attrs.lastSpeechOutput;
	}
	else {
		return false;
	}
}
// 4. Frame data retrieval functions =======================================================

/**
 * 
 * @param {String} character - The SFV character who frames we are looking up
 * @param {String} specialMove - The name of the Special Move or Unique Move we are looking up by name
 * @param {String} moveStrength - The strength of the special move (L, M, H, EX)
 * @param {String} frameType - The type of frames we are looking for (Startup, Active, Recovery, On Hit, On Block) this is set to "Startup" by default
 * @param {String} vSystem - The V-System modifier of the move (if it is performed while V-Trigger or V-Skill is activated)
 */
function retrieveSpecialMoveFrameData(character, specialMove, moveStrength, frameType = 'Startup', vSystem = undefined) {
	// Retrieve the character's move file from the Model

	fs.readFile('Model/' + character + '.json', (err, data) => {
		if (err) throw err;
		let returnedData = JSON.parse(data);
		console.log(returnedData[character]);
	});
}

/**
 * 
 * @param {String} character - The SFV character who frames we are looking up
 * @param {String} normalMove - The name of the Normal Move we are looking up (or Unique Move if we are looking it up by command like "Foward Fierce")
 * @param {String} position - The direction that is being held during the move (Up for Jumping, Down for Crouch, Forward, Back etc.)
 * @param {String} frameType - The type of frames we are looking for (Startup, Active, Recovery, On Hit, On Block) this is set to "Startup" by default
 * @param {String} vSystem - The V-System modifier of the move (if it is performed while V-Trigger or V-Skill is activated)
 */
function retrieveNormalMoveFrameData(character, normalMove, position, frameType = undefined, vSystem = undefined) {
	// Retrieve the character's move file from the Model
	fs.readFile('Model/' + character + '.json', (err, data) => {
		if (err) throw err;
		let returnedData = JSON.parse(data);
		console.log(returnedData[character]);
	});
}
// 5. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
	.addRequestHandlers(
		AMAZON_CancelIntent_Handler,
		AMAZON_HelpIntent_Handler,
		AMAZON_StopIntent_Handler,
		HelloWorldIntent_Handler,
		AMAZON_NavigateHomeIntent_Handler,
		GetSpecialMoveFrames_Handler,
		GetNormalMoveFrames_Handler,
		GetVSystemMoveFrames_Handler,
		LaunchRequest_Handler,
		SessionEndedHandler
	)
	.addErrorHandlers(ErrorHandler);

// End of Skill code -------------------------------------------------------------
// Static Language Model for reference
const model = {
	interactionModel: {
		languageModel: {
			invocationName: 'frame data',
			intents: [
				{
					name: 'AMAZON.CancelIntent',
					samples: [],
				},
				{
					name: 'AMAZON.HelpIntent',
					samples: [],
				},
				{
					name: 'AMAZON.StopIntent',
					samples: [],
				},
				{
					name: 'HelloWorldIntent',
					slots: [],
					samples: [ 'hello', 'how are you', 'say hi world', 'say hi', 'hi', 'say hello world', 'say hello' ],
				},
				{
					name: 'AMAZON.NavigateHomeIntent',
					samples: [],
				},
				{
					name: 'GetSpecialMoveFrames',
					slots: [
						{
							name: 'Character',
							type: 'Character',
							samples: [ '{Character}' ],
						},
						{
							name: 'VSystem',
							type: 'VSystem',
						},
						{
							name: 'FrameType',
							type: 'Frame',
						},
						{
							name: 'MoveStrength',
							type: 'MoveStrength',
						},
						{
							name: 'SpecialMove',
							type: 'SpecialMove',
							samples: [ '{SpecialMove}' ],
						},
					],
					samples: [
						'How many {FrameType} is {Character} {MoveStrength} {SpecialMove}',
						'How many frames is {Character} {MoveStrength} {SpecialMove}',
						'How many frames is {Character} {SpecialMove}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} {FrameType}',
						'Whats {Character} {MoveStrength} {SpecialMove} {FrameType}',
						'How many {FrameType} is {Character} {MoveStrength} {SpecialMove} in {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} in {VSystem}',
						'How many frames is {Character} {SpecialMove} in {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} in {VSystem} {FrameType}',
						'Whats {Character} {MoveStrength} {SpecialMove} {FrameType} in {VSystem}',
						'How many {FrameType} is {Character} {MoveStrength} {SpecialMove} during {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} during {VSystem}',
						'How many frames is {Character} {SpecialMove} during {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} during {VSystem} {FrameType}',
						'Whats {Character} {MoveStrength} {SpecialMove} {FrameType} during {VSystem}',
						'How many {FrameType} is {Character} {MoveStrength} {SpecialMove} with {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} with {VSystem}',
						'How many frames is {Character} {SpecialMove} with {VSystem}',
						'How many frames is {Character} {MoveStrength} {SpecialMove} with {VSystem} {FrameType}',
						'Whats {Character} {MoveStrength} {SpecialMove} {FrameType} with {VSystem}',
					],
				},
				{
					name: 'GetNormalMoveFrames',
					slots: [
						{
							name: 'Character',
							type: 'Character',
							samples: [ '{Character}' ],
						},
						{
							name: 'Position',
							type: 'Position',
						},
						{
							name: 'NormalMove',
							type: 'NormalMove',
							samples: [ '{NormalMove}' ],
						},
						{
							name: 'FrameType',
							type: 'Frame',
						},
						{
							name: 'VSystem',
							type: 'VSystem',
						},
						{
							name: 'Item',
							type: 'Items',
						},
					],
					samples: [
						'Whats {Character} {Position} {NormalMove} {FrameType}',
						'How many {FrameType} is {Character} {Position} {NormalMove}',
						'How many frames is {Character} {Position} {NormalMove}',
						'How many frames is {Character} {NormalMove}',
						'How many frames is {Character} {Position} {NormalMove} {FrameType}',
						'Whats {Character} {Position} {NormalMove} {FrameType} in {VSystem}',
						'How many {FrameType} is {Character} {Position} {NormalMove} in {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} in {VSystem}',
						'How many frames is {Character} {NormalMove} in {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} {FrameType} in {VSystem}',
						'Whats {Character} {Position} {NormalMove} {FrameType} during {VSystem}',
						'How many {FrameType} is {Character} {Position} {NormalMove} during {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} during {VSystem}',
						'How many frames is {Character} {NormalMove} during {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} during {VSystem} {FrameType}',
						'Whats {Character} {Position} {NormalMove} {FrameType} with {VSystem}',
						'How many {FrameType} is {Character} {Position} {NormalMove} with {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} with {VSystem}',
						'How many frames is {Character} {NormalMove} with {VSystem}',
						'How many frames is {Character} {Position} {NormalMove} with {VSystem} {FrameType}',
						'Whats {Character} {Position} {NormalMove} {FrameType} {Item}',
						'How many {FrameType} is {Character} {Position} {NormalMove} {Item}',
						'How many frames is {Character} {Position} {NormalMove} {Item}',
						'How many frames is {Character} {NormalMove} {Item}',
						'How many frames is {Character} {Position} {NormalMove} {Item} {FrameType}',
					],
				},
				{
					name: 'GetVSystemMoveFrames',
					slots: [
						{
							name: 'Character',
							type: 'Character',
							samples: [ '{Character}' ],
						},
						{
							name: 'VSystem',
							type: 'VSystem',
							samples: [ '{VSystem}' ],
						},
						{
							name: 'FrameType',
							type: 'Frame',
						},
					],
					samples: [
						'How many frames is {Character} {VSystem}',
						'How many {FrameType} is {Character} {VSystem}',
						'How many frames is {Character} {VSystem} {FrameType}',
					],
				},
			],
			types: [
				{
					name: 'Character',
					values: [
						{
							name: {
								value: 'Zeku Young',
								synonyms: [ 'Young', 'Young Zeku' ],
							},
						},
						{
							name: {
								value: 'Birdie',
							},
						},
						{
							name: {
								value: 'Cammy',
							},
						},
						{
							name: {
								value: 'Chun-Li',
							},
						},
						{
							name: {
								value: 'Dhalsim',
								synonyms: [ 'Sim' ],
							},
						},
						{
							name: {
								value: 'Fang',
								synonyms: [ 'F.A.N.G', 'Fong', 'Fang' ],
							},
						},
						{
							name: {
								value: 'Karin',
							},
						},
						{
							name: {
								value: 'Ken',
							},
						},
						{
							name: {
								value: 'Laura',
							},
						},
						{
							name: {
								value: 'M Bison',
								synonyms: [ 'Bison' ],
							},
						},
						{
							name: {
								value: 'Nash',
							},
						},
						{
							name: {
								value: 'Necalli',
							},
						},
						{
							name: {
								value: 'R. Mika',
								synonyms: [ 'Mika' ],
							},
						},
						{
							name: {
								value: 'Rashid',
							},
						},
						{
							name: {
								value: 'Ryu',
							},
						},
						{
							name: {
								value: 'Vega',
								synonyms: [ 'Claw' ],
							},
						},
						{
							name: {
								value: 'Zangief',
								synonyms: [ 'gief' ],
							},
						},
						{
							name: {
								value: 'Alex',
							},
						},
						{
							name: {
								value: 'Balrog',
								synonyms: [ 'Rog' ],
							},
						},
						{
							name: {
								value: 'Guile',
							},
						},
						{
							name: {
								value: 'Ibuki',
							},
						},
						{
							name: {
								value: 'Juri',
							},
						},
						{
							name: {
								value: 'Urien',
							},
						},
						{
							name: {
								value: 'Abigail',
							},
						},
						{
							name: {
								value: 'Akuma',
								synonyms: [ 'Gouki' ],
							},
						},
						{
							name: {
								value: 'Ed',
							},
						},
						{
							name: {
								value: 'Kolin',
							},
						},
						{
							name: {
								value: 'Menat',
							},
						},
						{
							name: {
								value: 'Zeku Old',
								synonyms: [ 'Old Zeku', 'Old' ],
							},
						},
						{
							name: {
								value: 'Blanka',
							},
						},
						{
							name: {
								value: 'Cody',
							},
						},
						{
							name: {
								value: 'Falke',
							},
						},
						{
							name: {
								value: 'G',
							},
						},
						{
							name: {
								value: 'Sagat',
							},
						},
						{
							name: {
								value: 'Sakura',
							},
						},
						{
							name: {
								value: 'E Honda',
								synonyms: [ 'Honda' ],
							},
						},
						{
							name: {
								value: 'Gill',
							},
						},
						{
							name: {
								value: 'Kage',
							},
						},
						{
							name: {
								value: 'Lucia',
							},
						},
						{
							name: {
								value: 'Poison',
							},
						},
						{
							name: {
								value: 'Seth',
							},
						},
					],
				},
				{
					name: 'SpecialMove',
					values: [
						{
							name: {
								value: 'Red fireball',
							},
						},
						{
							name: {
								value: 'Tatsu',
							},
						},
						{
							name: {
								value: 'DP',
								synonyms: [ 'D.P', 'Dragon punch' ],
							},
						},
						{
							name: {
								value: 'Fireball',
							},
						},
						{
							name: {
								value: 'Sonic Boom',
							},
						},
						{
							name: {
								value: 'Sonic Break',
							},
						},
						{
							name: {
								value: 'Sonic Cross',
							},
						},
						{
							name: {
								value: 'Somersault Kick',
							},
						},
						{
							name: {
								value: 'Shooting Peach',
								synonyms: [ 'Peach' ],
							},
						},
						{
							name: {
								value: 'Rainbow Typhoon',
								synonyms: [ 'Big Swing' ],
							},
						},
						{
							name: {
								value: 'Brimstone',
							},
						},
						{
							name: {
								value: 'Wingless Airplane',
								synonyms: [ 'Wingless' ],
							},
						},
						{
							name: {
								value: 'Steel Chair',
							},
						},
						{
							name: {
								value: "Fightin' Dirty",
							},
						},
						{
							name: {
								value: 'Soul Sphere',
							},
						},
						{
							name: {
								value: 'Guardian Of The Sun',
							},
						},
						{
							name: {
								value: 'Judgement Of Thoth',
							},
						},
						{
							name: {
								value: 'Prophecy Of Thoth',
							},
						},
						{
							name: {
								value: 'Spiral Arrow',
							},
						},
						{
							name: {
								value: 'Cannon Spike',
							},
						},
						{
							name: {
								value: 'Cannon Strike',
							},
						},
						{
							name: {
								value: 'Hooligan Combination',
							},
						},
						{
							name: {
								value: 'Hooligan Cannon Strike',
							},
						},
						{
							name: {
								value: 'Lazer Edge Slicer',
							},
						},
						{
							name: {
								value: 'Fatal Leg Twister',
							},
						},
						{
							name: {
								value: 'Cross Scissors Pressure',
							},
						},
						{
							name: {
								value: 'Delta Ambush',
							},
						},
						{
							name: {
								value: 'Delta Step',
							},
						},
						{
							name: {
								value: 'Delta Twist',
							},
						},
						{
							name: {
								value: 'Reverse Edge',
							},
						},
						{
							name: {
								value: 'Hadoken',
							},
						},
						{
							name: {
								value: 'Hadoken Level 2',
								synonyms: [ 'Level 2 Hadoken' ],
							},
						},
						{
							name: {
								value: 'Hadoken Level 3',
								synonyms: [ 'Level 3 Hadoken' ],
							},
						},
						{
							name: {
								value: 'EX Hadoken Level 1',
								synonyms: [ 'Level 1 EX Hadoken' ],
							},
						},
						{
							name: {
								value: 'EX Hadoken Level 2',
								synonyms: [ 'Level 2 Hadoken' ],
							},
						},
						{
							name: {
								value: 'Shoryuken',
							},
						},
						{
							name: {
								value: 'Tatsumaki Senpukyaku',
							},
						},
						{
							name: {
								value: 'Airborne Tatsumaki Senpukyaku',
							},
						},
						{
							name: {
								value: 'Jodan Sokutou Geri',
							},
						},
						{
							name: {
								value: 'Isshin (Stance)',
							},
						},
						{
							name: {
								value: 'Isshin (Attack)',
							},
						},
						{
							name: {
								value: 'Kikoken',
							},
						},
						{
							name: {
								value: 'Hyakuretsukyaku',
							},
						},
						{
							name: {
								value: 'Airborne Hyakuretsukyaku',
							},
						},
						{
							name: {
								value: 'Spinning Bird Kick',
							},
						},
						{
							name: {
								value: 'Kikosho',
							},
						},
						{
							name: {
								value: 'Kikosho (Charge)',
							},
						},
						{
							name: {
								value: 'Moonsault Slash',
							},
						},
						{
							name: {
								value: 'Tragedy Assault',
							},
						},
						{
							name: {
								value: 'Sonic Scythe',
							},
						},
						{
							name: {
								value: 'Stealth Dash',
							},
						},
						{
							name: {
								value: 'Justice Corridor',
							},
						},
						{
							name: {
								value: 'Justice Shell',
							},
						},
						{
							name: {
								value: 'Psycho Blast',
							},
						},
						{
							name: {
								value: 'Psycho Inferno',
							},
						},
						{
							name: {
								value: 'Double Knee Press',
							},
						},
						{
							name: {
								value: 'Head Press',
							},
						},
						{
							name: {
								value: 'Somersault Skull Diver',
							},
						},
						{
							name: {
								value: 'Devil Reverse',
							},
						},
						{
							name: {
								value: 'Psycho Crusher',
							},
						},
						{
							name: {
								value: 'Psycho Charge',
							},
						},
						{
							name: {
								value: 'Psycho Judgement',
							},
						},
						{
							name: {
								value: 'Psycho Inferno (Cancel)',
							},
						},
						{
							name: {
								value: 'Double Knee Press (Cancel)',
							},
						},
						{
							name: {
								value: 'Head Press (Cancel)',
							},
						},
						{
							name: {
								value: 'Spinning Mixer',
							},
						},
						{
							name: {
								value: 'Spinning Mixer Level 2',
							},
						},
						{
							name: {
								value: 'Spinning Mixer Level 3',
							},
						},
						{
							name: {
								value: 'Dash Spinning Mixer',
							},
						},
						{
							name: {
								value: 'Dash Spinning Mixer Level 2',
							},
						},
						{
							name: {
								value: 'Dash Spinning Mixer Level 3',
							},
						},
						{
							name: {
								value: 'Eagle Spike',
							},
						},
						{
							name: {
								value: 'Dash Eagle Spike',
							},
						},
						{
							name: {
								value: 'Airborne Eagle Spike',
							},
						},
						{
							name: {
								value: 'Whirlwind Shot',
							},
						},
						{
							name: {
								value: 'Haboob',
							},
						},
						{
							name: {
								value: 'Bull Head',
							},
						},
						{
							name: {
								value: 'Bull Horn',
							},
						},
						{
							name: {
								value: 'Hanging Chain',
							},
						},
						{
							name: {
								value: 'Bull Revenger',
							},
						},
						{
							name: {
								value: 'Killing Head',
							},
						},
						{
							name: {
								value: 'Bull Swing',
							},
						},
						{
							name: {
								value: 'Bull Capture',
							},
						},
						{
							name: {
								value: 'Shinryuken',
							},
						},
						{
							name: {
								value: 'Shinryuken Level 2',
							},
						},
						{
							name: {
								value: 'Shinryuken Level 3',
							},
						},
						{
							name: {
								value: "The Disc's Guidance",
							},
						},
						{
							name: {
								value: 'Raging Light',
							},
						},
						{
							name: {
								value: 'Mask of Tlalli',
							},
						},
						{
							name: {
								value: 'Valiant Rebellion',
							},
						},
						{
							name: {
								value: 'Clouded Mirror',
							},
						},
						{
							name: {
								value: 'Clouded Mirror (HOLD BUTTON)',
							},
						},
						{
							name: {
								value: 'Heart Of Gold',
							},
						},
						{
							name: {
								value: 'Kanzuki-Ryu Hokojutsu Seppo',
							},
						},
						{
							name: {
								value: 'Tenko',
							},
						},
						{
							name: {
								value: 'Tenko (Fastest)',
							},
						},
						{
							name: {
								value: 'Orochi',
							},
						},
						{
							name: {
								value: 'Mujinkyaku',
							},
						},
						{
							name: {
								value: 'Ressenha',
							},
						},
						{
							name: {
								value: 'Senha Resshu',
							},
						},
						{
							name: {
								value: 'Senha Kusabi',
							},
						},
						{
							name: {
								value: 'Guren Ken',
							},
						},
						{
							name: {
								value: 'Guren Hosho',
							},
						},
						{
							name: {
								value: 'Guren Senha',
							},
						},
						{
							name: {
								value: 'Guren Chochu',
							},
						},
						{
							name: {
								value: 'Guren Hochu',
							},
						},
						{
							name: {
								value: 'Guren Resshu',
							},
						},
						{
							name: {
								value: 'Guren Kusabi',
							},
						},
						{
							name: {
								value: 'Guren Kyoho',
							},
						},
						{
							name: {
								value: 'Yasha Gaeshi (Stance)',
							},
						},
						{
							name: {
								value: 'Yasha Gaeshi Ten',
							},
						},
						{
							name: {
								value: 'Yasha Gaeshi Chi',
							},
						},
						{
							name: {
								value: 'Flying Barcelona',
							},
						},
						{
							name: {
								value: 'Flying Barcelona Attack',
							},
						},
						{
							name: {
								value: 'Izuna Drop',
							},
						},
						{
							name: {
								value: 'Crimson Terror',
							},
						},
						{
							name: {
								value: 'Aurora Spin Edge',
							},
						},
						{
							name: {
								value: 'Switch Claw',
							},
						},
						{
							name: {
								value: 'Bloody Garden',
							},
						},
						{
							name: {
								value: 'Bloody Garden Attack',
							},
						},
						{
							name: {
								value: 'Bloody Garden Drop',
							},
						},
						{
							name: {
								value: 'Flash Arch Rossa (Stance)',
							},
						},
						{
							name: {
								value: 'Flash Arch Rossa (Attack)',
							},
						},
						{
							name: {
								value: 'Flash Arch Granate',
							},
						},
						{
							name: {
								value: 'Sky High Claw',
							},
						},
						{
							name: {
								value: 'Screw Pile Driver',
								synonyms: [ 'S.P.D' ],
							},
						},
						{
							name: {
								value: 'Siberian Express',
							},
						},
						{
							name: {
								value: 'Borscht Dynamite',
							},
						},
						{
							name: {
								value: 'Double Lariat',
							},
						},
						{
							name: {
								value: 'Tundra Storm',
							},
						},
						{
							name: {
								value: 'Cyclone Lariat',
							},
						},
						{
							name: {
								value: 'Activation Cyclone Lariat',
							},
						},
						{
							name: {
								value: 'Thunder Clap',
							},
						},
						{
							name: {
								value: 'Thunder Clap Level 2',
							},
						},
						{
							name: {
								value: 'Thunder Clap Level 3',
							},
						},
						{
							name: {
								value: 'Thunder Clap',
							},
						},
						{
							name: {
								value: 'Bolt Charge',
							},
						},
						{
							name: {
								value: 'Split River',
							},
						},
						{
							name: {
								value: 'Rodeo Break',
							},
						},
						{
							name: {
								value: 'Sunset Wheel',
							},
						},
						{
							name: {
								value: 'Matsuda Sway',
							},
						},
						{
							name: {
								value: 'Shock Choke',
							},
						},
						{
							name: {
								value: 'Linear Movement Avante (Movement)',
							},
						},
						{
							name: {
								value: 'Linear Movement Avante (Attack)',
							},
						},
						{
							name: {
								value: 'Volty Sprink',
							},
						},
						{
							name: {
								value: 'Thunder Spike',
							},
						},
						{
							name: {
								value: 'Heavy Heel',
							},
						},
						{
							name: {
								value: 'Yoga Fire',
							},
						},
						{
							name: {
								value: 'Yoga Flame',
							},
						},
						{
							name: {
								value: 'Yoga Gale',
							},
						},
						{
							name: {
								value: 'Yoga Teleport',
							},
						},
						{
							name: {
								value: 'Airborne Yoga Teleport',
							},
						},
						{
							name: {
								value: 'Yoga Sansara',
							},
						},
						{
							name: {
								value: 'Airborne Yoga Sansara',
							},
						},
						{
							name: {
								value: 'Yoga Sansara (Strengthened Version)',
							},
						},
						{
							name: {
								value: 'Nishikyu',
							},
						},
						{
							name: {
								value: 'Ryobenda',
							},
						},
						{
							name: {
								value: 'Ryobenda (Placed Poison)',
							},
						},
						{
							name: {
								value: 'Sotoja',
							},
						},
						{
							name: {
								value: 'Nikankyaku',
							},
						},
						{
							name: {
								value: 'Nikyoushu',
							},
						},
						{
							name: {
								value: 'Flash Chop',
							},
						},
						{
							name: {
								value: 'Slash Elbow',
								synonyms: [ 'Elbow' ],
							},
						},
						{
							name: {
								value: 'Air Knee Smash',
							},
						},
						{
							name: {
								value: 'Air Stampede',
							},
						},
						{
							name: {
								value: 'Head Crush',
							},
						},
						{
							name: {
								value: 'Power Bomb',
							},
						},
						{
							name: {
								value: 'Power Drop',
							},
						},
						{
							name: {
								value: 'Flyng DDT',
							},
						},
						{
							name: {
								value: 'Choke Sleeper',
							},
						},
						{
							name: {
								value: 'Sledge Hammer (Parry)',
							},
						},
						{
							name: {
								value: 'Sledge Hammer (Attack)',
							},
						},
						{
							name: {
								value: 'Sledge Hammer (Charge Attack)',
							},
						},
						{
							name: {
								value: 'Power Drop (Sledge Hammer Version)',
							},
						},
						{
							name: {
								value: 'Kazekiri',
							},
						},
						{
							name: {
								value: 'Raida',
							},
						},
						{
							name: {
								value: 'Kunai',
							},
						},
						{
							name: {
								value: 'Airborne Kunai',
							},
						},
						{
							name: {
								value: 'Kunai Ikkinage',
							},
						},
						{
							name: {
								value: 'Airborne Kunai Ikkinage',
							},
						},
						{
							name: {
								value: 'Kasumigake',
							},
						},
						{
							name: {
								value: 'Kunai Hoju',
							},
						},
						{
							name: {
								value: 'Rokushaku Horokudama (Akebono)',
							},
						},
						{
							name: {
								value: 'Rokushaku Horokudama (Hizakari)',
							},
						},
						{
							name: {
								value: 'Rokushaku Horokudama (Tasogare)',
							},
						},
						{
							name: {
								value: 'Dash Straight',
							},
						},
						{
							name: {
								value: 'Charging Buffalo 1',
							},
						},
						{
							name: {
								value: 'Charging Buffalo 2',
							},
						},
						{
							name: {
								value: 'Charging Buffalo 3',
							},
						},
						{
							name: {
								value: 'Charging Buffalo 4',
							},
						},
						{
							name: {
								value: 'Charging Buffalo',
							},
						},
						{
							name: {
								value: 'Dash Grand Blow',
							},
						},
						{
							name: {
								value: 'Screw Smash',
							},
						},
						{
							name: {
								value: 'Bursting Buffalo 1',
							},
						},
						{
							name: {
								value: 'Bursting Buffalo 2',
							},
						},
						{
							name: {
								value: 'Bursting Buffalo 3',
							},
						},
						{
							name: {
								value: 'Bursting Buffalo 4',
							},
						},
						{
							name: {
								value: 'Bursting Buffalo',
							},
						},
						{
							name: {
								value: 'Turn Punch Level 1',
							},
						},
						{
							name: {
								value: 'Turn Punch Level 2',
							},
						},
						{
							name: {
								value: 'Turn Punch Level 3',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 4)',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 5)',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 6)',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 7)',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 8)',
							},
						},
						{
							name: {
								value: 'Turn Punch (Level 9)',
							},
						},
						{
							name: {
								value: 'Turn Punch (FINAL)',
							},
						},
						{
							name: {
								value: 'B3',
							},
						},
						{
							name: {
								value: 'Fuharenkyaku (Charge Kick)',
							},
						},
						{
							name: {
								value: 'Fuharenkyaku',
							},
						},
						{
							name: {
								value: 'Tensenrin',
							},
						},
						{
							name: {
								value: 'Ryodansatsu',
							},
						},
						{
							name: {
								value: 'Chariot Tackle',
							},
						},
						{
							name: {
								value: 'Dangerous Headbutt',
							},
						},
						{
							name: {
								value: 'Violence Knee Drop',
							},
						},
						{
							name: {
								value: 'Metallic Sphere',
							},
						},
						{
							name: {
								value: 'Metallic Sphere (Hold Button)',
							},
						},
						{
							name: {
								value: '2nd Aegis Reflector (Forward)',
							},
						},
						{
							name: {
								value: '2nd Aegis Reflector (Back)',
							},
						},
						{
							name: {
								value: '2nd Aegis Reflector (Up)',
							},
						},
						{
							name: {
								value: 'Tyrant Blaze',
							},
						},
						{
							name: {
								value: 'Tyrant Blaze (Charge Attack)',
							},
						},
						{
							name: {
								value: 'Gohadoken',
							},
						},
						{
							name: {
								value: 'Sekia Goshoha',
							},
						},
						{
							name: {
								value: 'Zanku Hadoken',
							},
						},
						{
							name: {
								value: 'Zanku Hadoken (On release hit)',
							},
						},
						{
							name: {
								value: 'Zanku Hadoken (Projectile)',
							},
						},
						{
							name: {
								value: 'Goshoryuken',
							},
						},
						{
							name: {
								value: 'Tatsumaki Zankukyaku',
							},
						},
						{
							name: {
								value: 'Airborne Tatsumaki Zankukyaku',
							},
						},
						{
							name: {
								value: 'Ashura Senku (Forward)',
							},
						},
						{
							name: {
								value: 'Ashura Senku (Back)',
							},
						},
						{
							name: {
								value: 'Hyakkishu',
							},
						},
						{
							name: {
								value: 'Hyakki Gozan',
							},
						},
						{
							name: {
								value: 'Hyakki Gosho',
							},
						},
						{
							name: {
								value: 'Hyakki Gojin',
							},
						},
						{
							name: {
								value: 'Hyakki Gosai',
							},
						},
						{
							name: {
								value: 'Hyakki Gozanku (On startup hit)',
							},
						},
						{
							name: {
								value: 'Hyakki Gozanku (Projectile)',
							},
						},
						{
							name: {
								value: 'Hyakki Gorasen',
							},
						},
						{
							name: {
								value: 'Frost Touch Low',
							},
						},
						{
							name: {
								value: 'Frost Touch Mid',
							},
						},
						{
							name: {
								value: 'Frost Touch High',
							},
						},
						{
							name: {
								value: 'Parabellum',
							},
						},
						{
							name: {
								value: 'Vanity Step',
							},
						},
						{
							name: {
								value: 'SiLevel er Edge',
							},
						},
						{
							name: {
								value: 'Hailstorm',
							},
						},
						{
							name: {
								value: 'Frost Edge',
							},
						},
						{
							name: {
								value: 'Reverse Javelin (First Attack Only)',
							},
						},
						{
							name: {
								value: 'Reverse Javelin',
							},
						},
						{
							name: {
								value: 'Diamond Dust',
							},
						},
						{
							name: {
								value: 'Psycho Flicker',
							},
						},
						{
							name: {
								value: 'Psycho Spark',
							},
						},
						{
							name: {
								value: 'Psycho Shoot',
								synonyms: [ 'Psycho Shot' ],
							},
						},
						{
							name: {
								value: 'Psycho Knuckle',
							},
						},
						{
							name: {
								value: 'Psycho Upper',
							},
						},
						{
							name: {
								value: 'Psycho Rising',
							},
						},
						{
							name: {
								value: 'Psycho Splash',
							},
						},
						{
							name: {
								value: 'Ultra Snatcher Ground',
							},
						},
						{
							name: {
								value: 'Ultra Snatcher Air',
							},
						},
						{
							name: {
								value: 'Abigail Punch',
							},
						},
						{
							name: {
								value: 'Abigail Punch Rapid Button Press',
							},
						},
						{
							name: {
								value: 'Giant Flip',
							},
						},
						{
							name: {
								value: 'Giant Flip Rapid Button Press',
							},
						},
						{
							name: {
								value: 'Abigail Smash',
							},
						},
						{
							name: {
								value: 'Nitro Charge',
							},
						},
						{
							name: {
								value: 'Nitro Blitz',
							},
						},
						{
							name: {
								value: 'Dynamite Punch',
							},
						},
						{
							name: {
								value: 'Avalanche Press',
							},
						},
						{
							name: {
								value: 'Bay Area Sunrise',
							},
						},
						{
							name: {
								value: 'Hungabee High',
							},
						},
						{
							name: {
								value: 'Hungabee Low',
							},
						},
						{
							name: {
								value: 'Hungabee (upon successful parry)',
							},
						},
						{
							name: {
								value: 'Drop Back',
							},
						},
						{
							name: {
								value: 'Hungabee',
							},
						},
						{
							name: {
								value: 'Metro Crash',
							},
						},
						{
							name: {
								value: 'Metro Crash Level 2',
							},
						},
						{
							name: {
								value: 'Metro Crash Level 3',
							},
						},
						{
							name: {
								value: 'Bushin Gram Koku (base hit)',
							},
						},
						{
							name: {
								value: 'Bushin Gram Koku',
							},
						},
						{
							name: {
								value: 'Bushin Gram Ban (base hit)',
							},
						},
						{
							name: {
								value: 'Bushin Gram Ban',
							},
						},
						{
							name: {
								value: 'Bushin Gram Teki (base hit)',
							},
						},
						{
							name: {
								value: 'Bushin Gram Teki',
							},
						},
						{
							name: {
								value: 'Bushin Jakura',
							},
						},
						{
							name: {
								value: 'Bushin Gekirinchu',
							},
						},
						{
							name: {
								value: 'Bushin Kirinkyaku',
							},
						},
						{
							name: {
								value: 'Bushin Tengen',
							},
						},
						{
							name: {
								value: 'Shukumyo',
							},
						},
						{
							name: {
								value: 'Karura Tenzan',
							},
						},
						{
							name: {
								value: 'Idaten',
							},
						},
						{
							name: {
								value: 'Bushin Bakujasho',
							},
						},
						{
							name: {
								value: 'Bushin Sho',
							},
						},
						{
							name: {
								value: 'Hozanto',
							},
						},
						{
							name: {
								value: 'Bushin Sangoku Otoshi',
							},
						},
						{
							name: {
								value: 'Hayagake',
							},
						},
						{
							name: {
								value: 'Tozetsu',
							},
						},
						{
							name: {
								value: 'Ashikari',
							},
						},
						{
							name: {
								value: 'Gekkou',
							},
						},
						{
							name: {
								value: 'Shukumyo',
							},
						},
						{
							name: {
								value: 'Idaten',
							},
						},
						{
							name: {
								value: 'Bushin Seiryukyaku',
							},
						},
						{
							name: {
								value: 'Karura Tenzan',
							},
						},
						{
							name: {
								value: 'Hadoken (Charge)',
							},
						},
						{
							name: {
								value: 'Tengyo Hadoken',
							},
						},
						{
							name: {
								value: 'Tengyo Hadoken (Charge)',
							},
						},
						{
							name: {
								value: 'Shouoken',
							},
						},
						{
							name: {
								value: 'Shunpukyaku',
							},
						},
						{
							name: {
								value: 'Shunpukyaku (Hit)',
							},
						},
						{
							name: {
								value: 'Airborne Shunpukyaku',
							},
						},
						{
							name: {
								value: 'Hogasho',
							},
						},
						{
							name: {
								value: 'Shunpukyaku (Swish or Guard)',
							},
						},
						{
							name: {
								value: 'Rolling Attack',
							},
						},
						{
							name: {
								value: 'Vertical Rolling',
							},
						},
						{
							name: {
								value: 'Back Step Rolling',
							},
						},
						{
							name: {
								value: 'Electric Thunder',
							},
						},
						{
							name: {
								value: 'Wild Hunt',
							},
						},
						{
							name: {
								value: 'Rolling Cannon',
							},
						},
						{
							name: {
								value: 'Ground Shave Rolling',
							},
						},
						{
							name: {
								value: 'Ground Shave Rolling (Charge Attack)',
							},
						},
						{
							name: {
								value: 'Psycho Kugel',
							},
						},
						{
							name: {
								value: 'Psycho Kanonen',
							},
						},
						{
							name: {
								value: 'Psycho Feder',
							},
						},
						{
							name: {
								value: 'Psycho Schneide',
							},
						},
						{
							name: {
								value: 'Katapult',
							},
						},
						{
							name: {
								value: 'Katapult (Hit)',
							},
						},
						{
							name: {
								value: 'Psycho Schrot',
							},
						},
						{
							name: {
								value: 'Psycho Panzer',
							},
						},
						{
							name: {
								value: 'Psycho Jaeger',
							},
						},
						{
							name: {
								value: 'Psycho Sturm',
							},
						},
						{
							name: {
								value: 'Psycho Klinge',
							},
						},
						{
							name: {
								value: 'Tornado Sweep',
							},
						},
						{
							name: {
								value: 'Ruffian Kick',
							},
						},
						{
							name: {
								value: 'Zonk Knuckle',
							},
						},
						{
							name: {
								value: 'Zonk Knuckle Level 2',
							},
						},
						{
							name: {
								value: 'Snipe Shot',
							},
						},
						{
							name: {
								value: 'Anti-Air Snipe Shot',
							},
						},
						{
							name: {
								value: 'Reload',
							},
						},
						{
							name: {
								value: 'Rapid Fire',
							},
						},
						{
							name: {
								value: 'Gentle Swing',
							},
						},
						{
							name: {
								value: 'Gentle Upper Swing',
							},
						},
						{
							name: {
								value: 'Bean Ball',
							},
						},
						{
							name: {
								value: 'Present Delivery (High Hit)',
							},
						},
						{
							name: {
								value: 'Present Delivery (Mid Hit)',
							},
						},
						{
							name: {
								value: 'Present Delivery (Low Hit)',
							},
						},
						{
							name: {
								value: 'Unluck Gift',
							},
						},
						{
							name: {
								value: 'Toss & Smash (Throw)',
							},
						},
						{
							name: {
								value: 'Toss & Smash',
							},
						},
						{
							name: {
								value: 'G Smash Over Level 1',
								synonyms: [ 'Smash Over Level 1' ],
							},
						},
						{
							name: {
								value: 'G Smash Over Level 2',
								synonyms: [ 'Smash Over Level 2' ],
							},
						},
						{
							name: {
								value: 'G Smash Over Level 3',
								synonyms: [ 'Smash Over Level 3' ],
							},
						},
						{
							name: {
								value: 'G Smash Over',
								synonyms: [ 'Smash Over' ],
							},
						},
						{
							name: {
								value: 'G Smash Over (Cancel)',
							},
						},
						{
							name: {
								value: 'G Smash Under Level 1',
								synonyms: [ 'Smash Under Level 1' ],
							},
						},
						{
							name: {
								value: 'G Smash Under Level 2',
								synonyms: [ 'Smash Under Level 2' ],
							},
						},
						{
							name: {
								value: 'G Smash Under Level 3',
								synonyms: [ 'Smash Under Level 3' ],
							},
						},
						{
							name: {
								value: 'G Smash Under',
								synonyms: [ 'Smash Under' ],
							},
						},
						{
							name: {
								value: 'G Smash Under (Cancel)',
							},
						},
						{
							name: {
								value: 'G Burst Level 1',
								synonyms: [ 'Burst Level 1' ],
							},
						},
						{
							name: {
								value: 'G Burst Level 2',
								synonyms: [ 'Burst Level 2' ],
							},
						},
						{
							name: {
								value: 'G Burst Level 3',
								synonyms: [ 'Burst Level 3' ],
							},
						},
						{
							name: {
								value: 'G Burst',
							},
						},
						{
							name: {
								value: 'G Burst (Cancel)',
							},
						},
						{
							name: {
								value: 'G Spin Kick Level 1',
								synonyms: [ 'Spin Kick Level 1' ],
							},
						},
						{
							name: {
								value: 'G Spin Kick Level 2',
								synonyms: [ 'Spin Kick Level 2' ],
							},
						},
						{
							name: {
								value: 'G Spin Kick Level 3',
								synonyms: [ 'Spin Kick Level 3' ],
							},
						},
						{
							name: {
								value: 'G Spin Kick',
								synonyms: [ 'Spin Kick' ],
							},
						},
						{
							name: {
								value: 'G Spin Kick (Cancel)',
							},
						},
						{
							name: {
								value: 'G Impact Level 1',
								synonyms: [ 'Impact Level 1' ],
							},
						},
						{
							name: {
								value: 'G Impact Level 2',
								synonyms: [ 'Impact Level 2' ],
							},
						},
						{
							name: {
								value: 'G Impact Level 3',
								synonyms: [ 'Impact Level 3' ],
							},
						},
						{
							name: {
								value: 'G Impact',
								synonyms: [ 'Impact' ],
							},
						},
						{
							name: {
								value: 'G Impact (Cancel)',
							},
						},
						{
							name: {
								value: 'G Charge',
								synonyms: [ 'Charge' ],
							},
						},
						{
							name: {
								value: 'G Charge (Hold)',
							},
						},
						{
							name: {
								value: 'G Charge (Cancel)',
							},
						},
						{
							name: {
								value: 'G Explosion',
								synonyms: [ 'Explosion' ],
							},
						},
						{
							name: {
								value: 'G Rage',
								synonyms: [ 'Rage' ],
							},
						},
						{
							name: {
								value: 'G Rage (Cancel)',
							},
						},
						{
							name: {
								value: 'Tiger Shot',
							},
						},
						{
							name: {
								value: 'Grand Tiger Shot',
							},
						},
						{
							name: {
								value: 'Tiger Uppercut',
							},
						},
						{
							name: {
								value: 'Tiger Knee Crush',
							},
						},
						{
							name: {
								value: 'Tiger Cannon',
							},
						},
						{
							name: {
								value: 'Tiger Spike Level 1',
							},
						},
						{
							name: {
								value: 'Tiger Spike Level 2',
							},
						},
						{
							name: {
								value: 'Tiger Spike Level 3',
							},
						},
						{
							name: {
								value: 'Tiger Rush',
							},
						},
						{
							name: {
								value: 'Shakunetsu Hadoken',
							},
						},
						{
							name: {
								value: 'Kurekijin',
							},
						},
						{
							name: {
								value: 'Airborne Kurekijin',
							},
						},
						{
							name: {
								value: 'Ryusokyaku',
							},
						},
						{
							name: {
								value: 'Ashura Senku (Forward)',
							},
						},
						{
							name: {
								value: 'Ashura Senku (Back)',
							},
						},
						{
							name: {
								value: 'Airborne Ashura Senku (Forward)',
							},
						},
						{
							name: {
								value: 'Airborne Ashura Senku (Back)',
							},
						},
						{
							name: {
								value: 'Misogi',
							},
						},
						{
							name: {
								value: 'Sumo Headbutt',
								synonyms: [ 'Headbutt' ],
							},
						},
						{
							name: {
								value: 'Hundred Hand Slap',
							},
						},
						{
							name: {
								value: 'Sumo Smash',
							},
						},
						{
							name: {
								value: 'Sumo Smash(Cross-up)',
							},
						},
						{
							name: {
								value: 'Oicho Throw',
							},
						},
						{
							name: {
								value: 'Oni-Daikaku',
							},
						},
						{
							name: {
								value: 'Oni-Daikaku(Max Hold)',
							},
						},
						{
							name: {
								value: 'Oni-Muso',
							},
						},
						{
							name: {
								value: 'Iwato Biraki',
							},
						},
						{
							name: {
								value: 'Gun Smoke',
							},
						},
						{
							name: {
								value: 'Braking',
							},
						},
						{
							name: {
								value: 'Rough Chase',
							},
						},
						{
							name: {
								value: 'Tornado Spinner',
							},
						},
						{
							name: {
								value: 'Cyclone Spinner',
							},
						},
						{
							name: {
								value: 'Nubbing Needle',
							},
						},
						{
							name: {
								value: 'Firecracker',
							},
						},
						{
							name: {
								value: 'Flipper Shot',
							},
						},
						{
							name: {
								value: 'Flipper Shot L',
								synonyms: [ 'Flipper Shot Light' ],
							},
						},
						{
							name: {
								value: 'Flipper Shot M',
								synonyms: [ 'Flipper Shot Medium' ],
							},
						},
						{
							name: {
								value: 'Flipper Shot H',
								synonyms: [ 'Flipper Shot Heavy' ],
							},
						},
						{
							name: {
								value: 'Hurricane Spinner',
							},
						},
						{
							name: {
								value: 'Fire Spinner',
							},
						},
						{
							name: {
								value: 'Tactical Weapon',
							},
						},
						{
							name: {
								value: 'Avant Line',
							},
						},
						{
							name: {
								value: 'Heart Raid(Hold)',
							},
						},
						{
							name: {
								value: 'Heart Raid(Hold-Forward Movement)',
							},
						},
						{
							name: {
								value: 'Heart Raid(Hold-Backwards Movement)',
							},
						},
						{
							name: {
								value: 'Heart Raid(Hold Cancel)',
							},
						},
						{
							name: {
								value: 'Heart Raid',
							},
						},
						{
							name: {
								value: 'Heart Raid L',
								synonyms: [ 'Heart Raid Light' ],
							},
						},
						{
							name: {
								value: 'Heart Raid M',
								synonyms: [ 'Heart Raid Medium' ],
							},
						},
						{
							name: {
								value: 'Heart Raid H',
								synonyms: [ 'Heart Raid Heavy' ],
							},
						},
						{
							name: {
								value: 'Shocking Heel',
							},
						},
						{
							name: {
								value: 'Love Me Tender',
							},
						},
						{
							name: {
								value: 'Fire Squall',
							},
						},
						{
							name: {
								value: 'Toxic Hold',
							},
						},
						{
							name: {
								value: 'Toxic Bind',
							},
						},
						{
							name: {
								value: 'Pyrokinesis',
							},
						},
						{
							name: {
								value: 'Pyrokinesis L',
								synonyms: [ 'Pyrokinesis Light' ],
							},
						},
						{
							name: {
								value: 'Pyrokinesis M',
								synonyms: [ 'Pyrokinesis Medium' ],
							},
						},
						{
							name: {
								value: 'Pyrokinesis H',
								synonyms: [ 'Pyrokinesis Heavy' ],
							},
						},
						{
							name: {
								value: 'Cryokinesis',
							},
						},
						{
							name: {
								value: 'Cryokinesis L',
								synonyms: [ 'Cryokinesis Light' ],
							},
						},
						{
							name: {
								value: 'Cryokinesis M',
								synonyms: [ 'Cryokinesis Medium' ],
							},
						},
						{
							name: {
								value: 'Cryokinesis H',
								synonyms: [ 'Cryokinesis Heavy' ],
							},
						},
						{
							name: {
								value: 'Pyro Cyber Lariat',
							},
						},
						{
							name: {
								value: 'Cryo Cyber Lariat',
							},
						},
						{
							name: {
								value: 'Moonsault Knee Drop',
							},
						},
						{
							name: {
								value: 'Tree Of Frost',
							},
						},
						{
							name: {
								value: 'Delay Freeze Lance',
							},
						},
						{
							name: {
								value: 'Burn Storm',
							},
						},
						{
							name: {
								value: 'Flame Javelin',
							},
						},
						{
							name: {
								value: 'Volcanic Storm',
							},
						},
						{
							name: {
								value: 'Hecatoncheires',
							},
						},
						{
							name: {
								value: 'Mad Cradle',
							},
						},
						{
							name: {
								value: 'Cruel Distaster',
							},
						},
						{
							name: {
								value: 'Annihilate Sword',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (forward)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (backward)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (upward directions)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (down)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (down-forward)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (down-backward)',
							},
						},
						{
							name: {
								value: 'Tanden Maneuver Additional Control (ground bounce)',
							},
						},
						{
							name: {
								value: 'Tanden Explode',
							},
						},
						{
							name: {
								value: 'Titanomachy',
							},
						},
						{
							name: {
								value: 'Mad Spin',
							},
						},
						{
							name: {
								value: 'Mad Spin (Special Edition)',
							},
						},
						{
							name: {
								value: 'Cyclone Disaster',
							},
						},
						{
							name: {
								value: "Hell's Gate",
							},
						},
					],
				},
				{
					name: 'MoveStrength',
					values: [
						{
							name: {
								value: 'E.X.',
								synonyms: [ 'e-x', 'e.x', 'EX' ],
							},
						},
						{
							name: {
								value: 'Medium',
							},
						},
						{
							name: {
								value: 'Light',
							},
						},
						{
							name: {
								value: 'Heavy',
							},
						},
					],
				},
				{
					name: 'NormalMove',
					values: [
						{
							name: {
								value: 'Sweep',
								synonyms: [ 'crouch heavy kick', 'crouching heavy kick', 'Low heavy kick' ],
							},
						},
						{
							name: {
								value: 'Super',
								synonyms: [ 'Critical', 'Critical Art', 'C.A.' ],
							},
						},
						{
							name: {
								value: 'Roundhouse',
								synonyms: [ 'Hard Kick', 'Heavy Kick' ],
							},
						},
						{
							name: {
								value: 'Forward',
								synonyms: [ 'Medium Kick' ],
							},
						},
						{
							name: {
								value: 'Short',
								synonyms: [ 'Light Kick' ],
							},
						},
						{
							name: {
								value: 'Fierce',
								synonyms: [ 'Hard Punch', 'Heavy punch' ],
							},
						},
						{
							name: {
								value: 'Strong',
								synonyms: [ 'Medium Punch' ],
							},
						},
						{
							name: {
								value: 'Jab',
								synonyms: [ 'Light Punch' ],
							},
						},
					],
				},
				{
					name: 'Position',
					values: [
						{
							name: {
								value: 'Down Back',
							},
						},
						{
							name: {
								value: 'Down Forward',
							},
						},
						{
							name: {
								value: 'Back',
							},
						},
						{
							name: {
								value: 'Forward',
							},
						},
						{
							name: {
								value: 'Jump',
								synonyms: [ 'Jumping' ],
							},
						},
						{
							name: {
								value: 'Crouch',
								synonyms: [ 'Low', 'Crouching' ],
							},
						},
						{
							name: {
								value: 'Stand',
								synonyms: [ 'Standing' ],
							},
						},
					],
				},
				{
					name: 'Frame',
					values: [
						{
							name: {
								value: 'On hit',
								synonyms: [ 'when hit' ],
							},
						},
						{
							name: {
								value: 'On Block',
								synonyms: [ 'when blocked' ],
							},
						},
						{
							name: {
								value: 'Recovery',
								synonyms: [ 'Recovery Frames' ],
							},
						},
						{
							name: {
								value: 'Startup',
								synonyms: [ 'On startup', 'Startup Frames' ],
							},
						},
						{
							name: {
								value: 'Active',
								synonyms: [ 'Active Frames' ],
							},
						},
					],
				},
				{
					name: 'VSystem',
					values: [
						{
							name: {
								value: 'V-Skill 2',
							},
						},
						{
							name: {
								value: 'V-Trigger 2',
							},
						},
						{
							name: {
								value: 'V-Skill 1',
							},
						},
						{
							name: {
								value: 'V-Trigger 1',
							},
						},
					],
				},
				{
					name: 'Items',
					values: [
						{
							name: {
								value: 'without Claw',
							},
						},
						{
							name: {
								value: 'without Orb',
								synonyms: [ 'without Ball', 'without Crystal Ball' ],
							},
						},
						{
							name: {
								value: 'with Orb',
								synonyms: [ 'with Crystal Ball', 'with Ball' ],
							},
						},
						{
							name: {
								value: 'with Claw',
							},
						},
					],
				},
			],
		},
		dialog: {
			intents: [
				{
					name: 'GetSpecialMoveFrames',
					confirmationRequired: false,
					prompts: {},
					slots: [
						{
							name: 'Character',
							type: 'Character',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.273563289867.510108444629',
							},
						},
						{
							name: 'VSystem',
							type: 'VSystem',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'FrameType',
							type: 'Frame',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'MoveStrength',
							type: 'MoveStrength',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'SpecialMove',
							type: 'SpecialMove',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.273563289867.645209312172',
							},
						},
					],
				},
				{
					name: 'GetNormalMoveFrames',
					confirmationRequired: false,
					prompts: {},
					slots: [
						{
							name: 'Character',
							type: 'Character',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.269203712481.1362782905826',
							},
						},
						{
							name: 'Position',
							type: 'Position',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'NormalMove',
							type: 'NormalMove',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.269203712481.371669547237',
							},
						},
						{
							name: 'FrameType',
							type: 'Frame',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'VSystem',
							type: 'VSystem',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
						{
							name: 'Item',
							type: 'Items',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
					],
				},
				{
					name: 'GetVSystemMoveFrames',
					confirmationRequired: false,
					prompts: {},
					slots: [
						{
							name: 'Character',
							type: 'Character',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.35673318133.33295036285',
							},
						},
						{
							name: 'VSystem',
							type: 'VSystem',
							confirmationRequired: false,
							elicitationRequired: true,
							prompts: {
								elicitation: 'Elicit.Slot.535571396808.525453771178',
							},
						},
						{
							name: 'FrameType',
							type: 'Frame',
							confirmationRequired: false,
							elicitationRequired: false,
							prompts: {},
						},
					],
				},
			],
			delegationStrategy: 'ALWAYS',
		},
		prompts: [
			{
				id: 'Elicit.Slot.273563289867.510108444629',
				variations: [
					{
						type: 'PlainText',
						value: 'Which character did you want to get the frames for?',
					},
				],
			},
			{
				id: 'Elicit.Slot.273563289867.645209312172',
				variations: [
					{
						type: 'PlainText',
						value: 'Which special move did you want the frames for?',
					},
				],
			},
			{
				id: 'Elicit.Slot.269203712481.1362782905826',
				variations: [
					{
						type: 'PlainText',
						value: 'Which character did you want to get the frames for?',
					},
				],
			},
			{
				id: 'Elicit.Slot.269203712481.371669547237',
				variations: [
					{
						type: 'PlainText',
						value: 'Which normal move did you want the frames for?',
					},
				],
			},
			{
				id: 'Elicit.Slot.35673318133.33295036285',
				variations: [
					{
						type: 'PlainText',
						value: 'Which character did you want the frames for?',
					},
				],
			},
			{
				id: 'Elicit.Slot.535571396808.525453771178',
				variations: [
					{
						type: 'PlainText',
						value: 'Which V-Skill or V-Trigger did you want to get the frames for?',
					},
				],
			},
		],
	},
};
