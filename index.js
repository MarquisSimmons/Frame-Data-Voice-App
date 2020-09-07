/**
 * @author Marquis Simmons
 */
// Static Language Model for reference
const model = require('./Model/IntentSchema.json');
const Alexa = require('ask-sdk');
const invocationName = 'frame data';
const frameRetriever = require('./FrameDataRetrieval');

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

		let intents = [
			'How many frames is Chun-lis standing fierce on block',
			'How many frames is Kens heavy tatsu on block',
			'How many startup frames is Mikas peach',
			'What are the recovery frames for Akumas standing heavy punch',
			'How many frames is Seths low forward',
			'How many active frames is Guiles D.P',
		];
		let sampleIntent = randomElement(intents);

		let say = ' Here is something you can ask me. ' + sampleIntent;

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
		let characterName = ' ';
		let vSystem = ' ';
		let frameType = ' ';
		let moveStrength = ' ';
		let specialMoveName = ' ';

		let say = '';

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

		//   SLOT: Character
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			characterName = slotValues.Character.resolved;
		}
		else if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
			say = 'There was no frame data found for ' + slotValues.Character.heardAs + '. please try saying the character name again.';
			return responseBuilder
				.speak(say)
				.reprompt('please try saying the character name again.')
				.addElicitSlotDirective('Character')
				.getResponse();
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.VSystem.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			frameType = slotValues.FrameType.resolved;
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}
		//   SLOT: MoveStrength
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_MATCH') {
			moveStrength = slotValues.MoveStrength.resolved;
		}
		if (slotValues.MoveStrength.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.MoveStrength.heardAs + '" to the custom slot type used by slot MoveStrength! ');
		}
		//   SLOT: SpecialMove
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_MATCH') {
			specialMoveName = slotValues.SpecialMove.resolved;
		}
		if (slotValues.SpecialMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.SpecialMove.heardAs + '" to the custom slot type used by slot SpecialMove! ');
			say = 'Frame data for, ' + slotValues.SpecialMove.heardAs + ' could not be found. try saying the move name again';

			return responseBuilder.speak(say).addElicitSlotDirective('SpecialMove').getResponse();
		}

		say = frameRetriever.retrieveSpecialMoveFrameData(characterName, specialMoveName, moveStrength, frameType, vSystem);
		return responseBuilder.speak(say).getResponse();
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

		let characterName = ' ';
		let vSystem = ' ';
		let frameType = ' ';
		let position = ' ';
		let normalMove = ' ';

		let say = '';

		let slotValues = getSlotValues(request.intent.slots);
		// getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

		// console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
		//   SLOT: Character
		if (slotValues.Character.ERstatus === 'ER_SUCCESS_MATCH') {
			characterName = slotValues.Character.resolved;
		}
		else if (slotValues.Character.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Character.heardAs + '" to the custom slot type used by slot Character! ');
			say = 'There was no frame data found for ' + slotValues.Character.heardAs + '. please try saying the character name again.';
			return responseBuilder
				.speak(say)
				.reprompt('please try saying the character name again.')
				.addElicitSlotDirective('Character')
				.getResponse();
		}
		//   SLOT: Position
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_MATCH') {
			position = slotValues.Position.resolved;
		}
		if (slotValues.Position.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.Position.heardAs + '" to the custom slot type used by slot Position! ');
		}
		//   SLOT: NormalMove
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_MATCH') {
			normalMove = slotValues.NormalMove.resolved;
		}
		if (slotValues.NormalMove.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.NormalMove.heardAs + '" to the custom slot type used by slot NormalMove! ');
			say = 'Frame data for, ' + slotValues.NormalMove.heardAs + ' could not be found. try saying the move again';

			return responseBuilder.speak(say).addElicitSlotDirective('NormalMove').getResponse();
		}
		//   SLOT: FrameType
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_MATCH') {
			frameType = slotValues.FrameType.resolved;
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}
		//   SLOT: VSystem
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.VSystem.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}
		//   SLOT: Item
		if (slotValues.Item.ERstatus === 'ER_SUCCESS_MATCH') {
			vSystem = slotValues.Item.resolved;
		}
		if (slotValues.VSystem.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			console.log('***** consider adding "' + slotValues.VSystem.heardAs + '" to the custom slot type used by slot VSystem! ');
		}

		say = frameRetriever.retrieveNormalMoveFrameData(characterName, normalMove, position, frameType, vSystem);

		return responseBuilder.speak(say).getResponse();
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
			}
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
			}
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
			}
		}
		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH') {
			slotStatus += 'which did not match any slot value. ';
			console.log('***** consider adding "' + slotValues.FrameType.heardAs + '" to the custom slot type used by slot FrameType! ');
		}

		if (slotValues.FrameType.ERstatus === 'ER_SUCCESS_NO_MATCH' || !slotValues.FrameType.heardAs) {
			slotStatus += 'A few valid values are, ' + sayArray(getExampleSlotValues('GetVSystemMoveFrames', 'FrameType'), 'or');
		}

		say += slotStatus;

		return responseBuilder.speak(say).getResponse();
	},
};

const LaunchRequest_Handler = {
	canHandle(handlerInput) {
		const request = handlerInput.requestEnvelope.request;
		return request.type === 'LaunchRequest';
	},
	handle(handlerInput) {
		const responseBuilder = handlerInput.responseBuilder;

		let say = 'Hey welcome to ' + invocationName + ' what would you like to look up? You can say help to find out your options';

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

// 2.  Helper Functions ===================================================================
function capitalize(myString) {
	return myString.replace(/(?:^|\s)\S/g, function(a) {
		return a.toUpperCase();
	});
}

function randomElement(myArray) {
	return myArray[Math.floor(Math.random() * myArray.length)];
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
		if (intents[i].name === intentName) {
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

// 4. Frame data retrieval functions =======================================================

// 5. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
	.addRequestHandlers(
		AMAZON_CancelIntent_Handler,
		AMAZON_HelpIntent_Handler,
		AMAZON_StopIntent_Handler,
		AMAZON_NavigateHomeIntent_Handler,
		GetSpecialMoveFrames_Handler,
		GetNormalMoveFrames_Handler,
		GetVSystemMoveFrames_Handler,
		LaunchRequest_Handler,
		SessionEndedHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();

// End of Skill code -------------------------------------------------------------
