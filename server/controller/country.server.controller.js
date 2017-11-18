var CountryModel = require('../model/country.server.model.js');

module.exports = {

  addCountry: function (req, res) {
    var code = req.body.code;
    var name = req.body.name;
    CountryModel.findOne({code: code})
      .then(function (c) {
        if (c) {
          throw new Error('409');
        }
        if (!code || !name) {
          throw new Error('400');
        }
        var country = new CountryModel({
          code:   code,
          name:   name,
        });
        return country.save();
      })
      .then(function (c) {
        return res.status(200).json({message: 'Country saved'});
      })
      .catch(function (error) {
        if (error.message === '409') {
          return res.status(409).json({message: 'Code Already exists'});
        } else if (error.message === '400') {
          return res.status(400).json({message: 'Bad Request'});
        } else {
          return res.status(500).json({message: err.message});
        }
      });
  },
}