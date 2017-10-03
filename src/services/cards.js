function CardsService(settings, log){
  this.cards = {};
  this.cards = settings.get('cards');
  if(!this.cards)
    this.cards = {};
  
  /**
   * [getPaymentScheme get payment scheme identifire, base on card number. 
   *                Of course, the life is much more complicated, and there are BIN tables
   *                for that purposes, but here we are just have a naive implementation, 
   *                based on the checking the first digit of the card number]
   * @param  {[type]} cardnumber [description]
   * @return {[type]}            [description]
   */
  this.getPaymentScheme = function(cardnumber){
    if(cardnumber[0] === '4')
      return 'VISA';
    else if(cardnumber[0] === '5')
      return 'Mastercard';
    else if(cardnumber[0] === '6')
      return 'CUP';
  };

  /**
   * [add description]
   * @param {[type]} card [description]
   */
  this.add = function(card){
    if(card.name === undefined || card.name === '')
      card.name = card.number;

    var scheme = this.getPaymentScheme(card.number);
    if(scheme)
      card.scheme = scheme;

    this.cards[card.name] = card;
    settings.set('cards', this.cards);

    return true;
  };

  /**
   * [remove description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  this.remove = function(name){
    this.cards[name] = undefined;
  }

  /**
   * [get description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  this.get = function(name){
    return this.cards[name];
  };

  /**
   * [getNames description]
   * @return {[type]} [description]
   */
  this.getNames = function(){
    var names = [];

    for (var card in this.cards)
      if (this.cards.hasOwnProperty(card) && this.cards[card])
        names.push(card);

      return names;
  };

  /**
   * [getTrack2 description]
   * @param  {[type]} card [description]
   * @return {[type]}      [description]
   */
  this.getTrack2 = function(card){
    if(!card)
      return;

    var track2 = card.expiry_date + card.service_code + card.pvki + card.pvv + card.cvv;

    if(card.discretionary_data)
      track2 += card.discretionary_data;

    return track2;
  };


  /**
   * [decorateCardNumber description]
   * @param  {[type]} cardnumber [description]
   * @return {[type]}            [description]
   */
  this.decorateCardNumber = function(cardnumber){
    var decorated = '';

    for(var i = 0; i < cardnumber.length; i++){
      if(i % 4 === 0 && i !== 0 && cardnumber[i] !== ' '){
        decorated += ' ';
      }

      decorated += cardnumber[i];
    }

    return decorated;
  }
}

module.exports = CardsService;