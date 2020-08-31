const model = require('./Model/IntentSchema.json');
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
		let characterName = ' ';
		let vSystem = ' ';
		let frameType = ' ';
		let moveStrength = ' ';
		let specialMoveName = ' ';

		let say = '';

		let slotStatus = '';
		let resolvedSlot;

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
			if (slotValues.SpecialMove.heardAs.includes('v skill') || slotValues.SpecialMove.heardAs.includes('v trigger')) {
				let separateMoves = stripVSystemFromMove(slotValues.SpecialMove.heardAs);
				if (separateMoves.length === 2) {
					specialMoveName = separateMoves[0]; // TODO: Some how convert this value to the a valid slot value
					vSystem = separateMoves[1];
					say = retrieveSpecialMoveFrameData(characterName, specialMoveName, moveStrength, frameType, vSystem);
					return responseBuilder.speak(say).getResponse();
				}
			}
			console.log('***** consider adding "' + slotValues.SpecialMove.heardAs + '" to the custom slot type used by slot SpecialMove! ');
			say =
				'Frame data for, ' +
				slotValues.SpecialMove.heardAs +
				' could not be found.' +
				'A few valid values are, ' +
				sayArray(getExampleSlotValues('GetSpecialMoveFrames', 'SpecialMove'), 'or');
			return responseBuilder.speak(say).getResponse();
		}

		say = retrieveSpecialMoveFrameData(characterName, specialMoveName, moveStrength, frameType, vSystem);
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

// Here you can define static data, to be used elsewhere in your code.
const moveStrengthMapping = {
	Light: 'L',
	Medium: 'M',
	Heavy: 'H',
	'E.X': 'EX',
};
const frameTypeMapping = {
	'On Hit': 'framesOnHit',
	'On Block': 'framesOnBlock',
	Startup: 'startUpFrames',
	Recovery: 'recoveryFrames',
	Active: 'activeFrames',
};
const vSystemMapping = {
	'V-Skill 2': 'V-Skill 2 Version',
	'V-Skill 1': 'V-Skill 1 Version',
	'V-Trigger 1': 'V-',
	'V-Trigger 2': 'V-',
	'v skill 1': 'V-Skill 1 Version',
	'v skill 2': 'V-Skill 2 Version',
	'v trigger 1': 'V-',
	'v trigger 2': 'V-',
};
const normalMoveMapping = {
	Sweep: 'Crouching HK',
	Roundhouse: 'HK',
	Forward: 'MK',
	Short: 'LK',
	Fierce: 'HP',
	Strong: 'MP',
	Jab: 'LP',
};
const moveSynonyms = [ 'DP', 'Fireball', 'Tatsu', 'Red Fireball' ];

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

/**
 * This function separates the v-system slot from the move name slot incase Alexa interprets them both as one big move 
 * ex. (Charging Buffalo 1 during v trigger 1) -> [ 'Charging Buffalo 1', 'v trigger 1' ]
 * @param {string} move the move string as heard by Alexa
 */
function stripVSystemFromMove(move) {
	let splitMove = [];
	if (move.includes('with')) {
		splitMove = move.split('with').map((move) => {
			return move.trim();
		});
	}
	else if (move.includes('during')) {
		splitMove = move.split('during').map((move) => {
			return move.trim();
		});
	}
	else if (move.includes('in')) {
		if (move.includes('v skill')) {
			const vSystem = move.slice(-9);
			let remainder = move.slice(0, -9).trim();
			splitMove = [ remainder.slice(-2).trim(), vSystem ];
		}
		else if (move.includes('v trigger')) {
			const vSystem = move.slice(-11);
			let remainder = move.slice(0, -11).trim();
			splitMove = [ remainder.slice(0, -2).trim(), vSystem ];
		}
	}
	else {
		console.log('Move does not conform to special move + v-system format: ' + move);
	}

	return splitMove;
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
function retrieveSpecialMoveFrameData(character, specialMove, moveStrength, frameType, vSystem) {
	// Retrieve the character's move file from the Model
	let fullMoveLookup = ' ';
	let defaultFrameType = frameType !== ' ' ? frameType : 'Startup';

	const lookupVSystem = vSystemMapping[vSystem];
	let lookupMoveStrength = moveStrengthMapping[moveStrength];
	const lookupFrameType = frameTypeMapping[defaultFrameType];

	const data = fs.readFileSync('Model/' + character + '.json');
	if (!data) {
		console.log('File: Model/' + character + '.json could not be found');
		return 'There was a problem retrieving frame data for ' + character + '. You can try another character until this is resolved.';
	}
	const returnedData = JSON.parse(data);
	const characterSpecialMoveList = returnedData[character]['Special Moves'];

	if (!specialMove) {
		return 'There was no special move defined';
	}
	if (moveSynonyms.includes(specialMove)) {
		// Case if the move is heard as Fireball, Tatsu, DP etc.
		console.log(specialMove + ': ' + 'has been converted to: ' + ' ' + returnedData[character][specialMove]);
		specialMove = returnedData[character][specialMove];
	}
	// Can be "V-L Special Move" or "L Special Move V-Skill 1 Version"
	switch (lookupVSystem) {
		case undefined:
			fullMoveLookup = lookupMoveStrength ? lookupMoveStrength + ' ' + specialMove : specialMove;
			break;
		case ('V-Skill 1 Version', 'V-Skill 2 Version'):
			fullMoveLookup = lookupMoveStrength + ' ' + specialMove + lookupVSystem;
			break;
		default:
			fullMoveLookup = lookupMoveStrength ? lookupVSystem + lookupMoveStrength + ' ' + specialMove : lookupVSystem + specialMove;
			break;
	}
	let move = characterSpecialMoveList[fullMoveLookup];

	console.log(character, specialMove, moveStrength, lookupFrameType, lookupVSystem);

	// Case we find the move successfully with all of the necessary slots filled out
	if (move) {
		console.log(character + "'s " + fullMoveLookup + ' found.');
		if (frameType == 'On Hit' || frameType == 'On Block') {
			const frameNumber = move[lookupFrameType] <= 0 ? move[lookupFrameType] : 'plus ' + move[lookupFrameType];
			const outputWithVSystem =
				character + 's ' + moveStrength + ' ' + specialMove + ' is ' + frameNumber + ' frames ' + defaultFrameType + ' with ' + vSystem;
			const output = character + 's ' + moveStrength + ' ' + specialMove + ' is ' + frameNumber + ' frames ' + defaultFrameType;
			return lookupVSystem ? outputWithVSystem : output;
		}
		else {
			const outputWithVSystem =
				character +
				's ' +
				moveStrength +
				' ' +
				specialMove +
				' has ' +
				move[lookupFrameType] +
				' ' +
				defaultFrameType +
				' frames with ' +
				vSystem;

			const output =
				character + 's ' + moveStrength + ' ' + specialMove + ' has ' + move[lookupFrameType] + ' ' + defaultFrameType + ' frames.';
			return lookupVSystem ? outputWithVSystem : output;
		}
	}
	else if (!lookupMoveStrength) {
		console.log(character + "'s " + fullMoveLookup + ' not found. Looking up move again with move strength');
		// If we cannot find the move, check if it is because the user did not specify the move strength
		// If move strength is undefined then default it to Light
		// - Note: Some moves do not have move strengths which is why we only want to assign a default move strength iff the move could not be found.
		lookupMoveStrength = 'L';
		moveStrength = 'Light';
		switch (lookupVSystem) {
			case undefined:
				fullMoveLookup = lookupMoveStrength + ' ' + specialMove;
				break;
			case ('V-Skill 1 Version', 'V-Skill 2 Version'):
				fullMoveLookup = lookupMoveStrength + ' ' + specialMove + lookupVSystem;
				break;
			default:
				fullMoveLookup = lookupVSystem + lookupMoveStrength + ' ' + specialMove;
				break;
		}
		// Retrieve the move again but this time using a default move strength
		move = characterSpecialMoveList[fullMoveLookup];
		if (move) {
			console.log(character + "'s " + fullMoveLookup + ' found after adding move strength.');
			if (frameType == 'On Hit' || frameType == 'On Block') {
				const frameNumber = move[lookupFrameType] <= 0 ? move[lookupFrameType] : 'plus ' + move[lookupFrameType];
				const outputWithVSystem =
					character + 's ' + moveStrength + ' ' + specialMove + ' is ' + frameNumber + ' frames ' + defaultFrameType + ' with ' + vSystem;
				const output = character + 's ' + moveStrength + ' ' + specialMove + ' is ' + frameNumber + ' frames ' + defaultFrameType;
				return lookupVSystem ? outputWithVSystem : output;
			}
			else {
				const outputWithVSystem =
					character +
					's ' +
					moveStrength +
					' ' +
					specialMove +
					' has ' +
					move[lookupFrameType] +
					' ' +
					defaultFrameType +
					' frames with ' +
					vSystem;

				const output =
					character + 's ' + moveStrength + ' ' + specialMove + ' has ' + move[lookupFrameType] + ' ' + defaultFrameType + ' frames.';
				return lookupVSystem ? outputWithVSystem : output;
			}
		}
	}
	console.log(character + "'s " + fullMoveLookup + ' not found');
	return 'The frame data for ' + character + "'s " + moveStrength + ' ' + specialMove + ' could not be found';
}

/**
 * 
 * @param {String} character - The SFV character who frames we are looking up
 * @param {String} normalMove - The name of the Normal Move we are looking up (or Unique Move if we are looking it up by command like "Foward Fierce")
 * @param {String} position - The direction that is being held during the move (Up for Jumping, Down for Crouch, Forward, Back etc.)
 * @param {String} frameType - The type of frames we are looking for (Startup, Active, Recovery, On Hit, On Block) this is set to "Startup" by default
 * @param {String} vSystem - The V-System modifier of the move (if it is performed while V-Trigger or V-Skill is activated)
 */
function retrieveNormalMoveFrameData(character, normalMove, position, frameType, vSystem) {
	// Retrieve the character's move file from the Model
	fs.readFile('Model/' + character + '.json', (err, data) => {
		if (err) throw err;
		let returnedData = JSON.parse(data);
		let characterSpecialMoveList = returnedData[character];
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
	.addErrorHandlers(ErrorHandler)
	.lambda();

// End of Skill code -------------------------------------------------------------
// Static Language Model for reference
