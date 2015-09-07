
var CommentCarousel = require('./commentCarousel');
var carouselCommentMobileTemplate = require("../tmpl/carouselCommentMobile");
var carouselCommentTemplate = require("../tmpl/carouselComment");
var constants = require("../util/constants");
var display = require("../util/display");
var eb = require("../eventBus");
var template = require("../tmpl/commentCarouselMajority");
var Strings = require("../strings");
var Utils = require("../util/utils");

module.exports = CommentCarousel.extend({
  name: "comment-carousel-majority-view",
  className: "infoArea",
  commentLimit: 10,
  el_carouselSelector: "carouselConsensus",
  el_prevButton: "majorityCarouselPrev",
  el_nextButton: "majorityCarouselNext",
  el_smallWindow: "smallWindow2",
  el_parent: "majorityCarouselParent",
  template: template,

  generateItemsHTML: function() {
    var that = this;
    // Copy comments out of collection. don't want to sort collection, since it's shared with Analyze View.
    var commentsAll = that.collection.models.slice(0);
    // comments = _.filter(comments, function(comment) {
    //   return _.contains(tids, comment.get('tid'));
    // });
    var consensusComments = that.getTidsForConsensus();

    var tidToConsensusInfo = _.indexBy(consensusComments, "tid");

    var comments = _.filter(commentsAll, function(c) {
      return !!tidToConsensusInfo[c.get("tid")];
    });
    comments = _.map(comments, function(c) {
      c.set("p-success", tidToConsensusInfo[c.get("tid")]["p-success"]);
      return c;
    });
    comments.sort(function(a, b) {
      return b.get("p-success") - a.get("p-success");
    });

    var indexToTid  = [];

    var items = _.map(comments, function(c) {
      var tid = c.get('tid');
      indexToTid.push(tid);
      var info = tidToConsensusInfo[tid];
      var bodyColor = "#333";
      // var createdString = (new Date(c.get("created") * 1)).toString().match(/(.*?) [0-9]+:/)[1];

      var forAgree = !!tidToConsensusInfo[tid].a;

      var denominator = info["n-trials"];

      var percent = forAgree ?
        "<i class='fa fa-check-circle-o'></i> " + ((info["n-success"] / denominator * 100) >> 0) : // WARNING duplicated in analyze-comment.js
        "<i class='fa fa-ban'></i>  " + ((info["n-success"] / denominator * 100) >> 0); // WARNING duplicated in analyze-comment.js
      var leClass = forAgree ? "a": "d";
      var count = info["n-success"];
      var agreedOrDisagreed = forAgree ?
        "<span class='a'>"+Strings.pctAgreed+"</span>" :
        "<span class='d'>"+Strings.pctDisagreed+"</span>";
      agreedOrDisagreed = agreedOrDisagreed.replace("{{pct}}", percent);

      // var backgroundColor = forAgree ? "rgba(46, 204, 84, 0.07)" : "rgba(246, 208, 208, 1)";
      var backgroundColor = "white"; //forAgree ? "rgba(192, 228, 180, 1)" : "rgba(246, 208, 208, 1)";
      var dotColor = forAgree ? "#00b54d" : "#e74c3c";
      var gradient = "";
      var social = c.get("social");
      var socialCtx = {
        name: Strings.anonPerson,
        img: Utils.getAnonPicUrl(),
        link: "",
        anon: true,
      };
      if (social) {
        var hasTwitter = social.screen_name;
        var hasFacebook = social.fb_name;
        if (hasFacebook) {
          socialCtx = {
            name: social.fb_name,
            img: social.fb_picture,
            link: social.fb_link,
          };
        }
        if (hasTwitter) {
          socialCtx = {
            name: social.name,
            img: social.twitter_profile_image_url_https,
            link: "https://twitter.com/" + social.screen_name,
            screen_name: social.screen_name,
          };
        }
      }

      var tmpl = display.xs() ? carouselCommentMobileTemplate : carouselCommentTemplate;

      var html = tmpl({
        majorityMode: true,
        backgroundColor: backgroundColor,
        bodyColor: bodyColor,
        tweet_id: c.get("tweet_id"),
        s: Strings,
        txt: c.get("txt"),
        index: indexToTid.length-1,
        socialCtx: socialCtx,
        agreedOrDisagreed: agreedOrDisagreed,
        leClass: leClass,
        count: count,
        nTrials: info["n-trials"],
        repfullForAgree: forAgree,
        commentCarouselMinHeight: constants.commentCarouselMinHeight,
      });

      return {
        html: html,
        color: dotColor
      };
    });

    return {
      items: items,
      indexToTid: indexToTid,
    };
  },

  context: function() {
    var ctx = CommentCarousel.prototype.context.apply(this, arguments);
    ctx.s = Strings;
    return ctx;
  },
  initialize: function(options) {
    CommentCarousel.prototype.initialize.apply(this, arguments);
    var that = this;
    this.collection = options.collection;
    this.getTidsForConsensus = options.getTidsForConsensus;
  }
});
