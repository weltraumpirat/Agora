'use strict';

require('../../testutil/configureForTest');
const expect = require('must-dist');

const beans = require('simple-configure').get('beans');
const Subscriber = beans.get('subscriber');

describe('Subscriber\'s Addon', () => {

  it('is never undefined', () => {
    const subscriber = new Subscriber();
    expect(subscriber.addon()).to.exist();
  });

  it('returns the values stored in the subscriber\'s addon', () => {
    const subscriber = new Subscriber({_addon: {homeAddress: 'homeOne', billingAddress: 'billingTwo', tShirtSize: 'XXXL'}});
    expect(subscriber.addon().homeAddress()).to.equal('homeOne');
    expect(subscriber.addon().billingAddress()).to.equal('billingTwo');
    expect(subscriber.addon().tShirtSize()).to.equal('XXXL');
  });

  it('can be filled from the UI (unpacks t-shirt size)', () => {
    const addonDataUI = {homeAddress: 'homeOne', billingAddress: 'billingTwo', tShirtSize: ['XXXL', '']};
    const addonData = {homeAddress: 'homeOne', billingAddress: 'billingTwo', tShirtSize: 'XXXL', remarks: undefined};
    const subscriberFromUI = new Subscriber();
    subscriberFromUI.addon().fillFromUI(addonDataUI);
    expect(subscriberFromUI).to.eql(new Subscriber({_addon: addonData}));
  });

  it('splits up the home and billing address into lines', () => {
    const subscriber = new Subscriber({_addon: {homeAddress: 'name1\nstreet1\ncity1', billingAddress: 'name2\n\nstreet2\ncity2\ncountry2\n'}});
    expect(subscriber.addon().homeAddressLines().length).to.equal(3);
    expect(subscriber.addon().homeAddressLines()).to.eql(['name1', 'street1', 'city1']);
    expect(subscriber.addon().billingAddressLines().length).to.equal(6);
    expect(subscriber.addon().billingAddressLines()).to.eql(['name2', '', 'street2', 'city2', 'country2', '']);
  });

  it('returns an empty array if no home or billing address can be found', () => {
    const subscriber = new Subscriber();
    expect(subscriber.addon().homeAddressLines().length).to.equal(0);
    expect(subscriber.addon().homeAddressLines()).to.eql([]);
    expect(subscriber.addon().billingAddressLines().length).to.equal(0);
    expect(subscriber.addon().billingAddressLines()).to.eql([]);
  });

});
