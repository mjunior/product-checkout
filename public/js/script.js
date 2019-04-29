"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

(function () {
  var Util =
  /*#__PURE__*/
  function () {
    function Util() {
      _classCallCheck(this, Util);
    }

    _createClass(Util, null, [{
      key: "formatMoney",
      value: function formatMoney(amount) {
        var decimalCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
        var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ",";
        var thousands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ".";

        if (isNaN(amount)) {
          return "";
        }

        var format = {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'BRL'
        };
        return amount.toLocaleString('pt-BR', format);
      }
    }]);

    return Util;
  }(); //ModalScript


  var EnjoeiModal =
  /*#__PURE__*/
  function () {
    function EnjoeiModal(title, text) {
      _classCallCheck(this, EnjoeiModal);

      this.title = title;
      this.text = text;
    }

    _createClass(EnjoeiModal, [{
      key: "fire",
      value: function fire() {
        Swal.fire({
          title: this.title || 'compra efetuada',
          text: this.text || 'enviaremos informacoes por email',
          showCloseButton: false,
          showCancelButton: false,
          showConfirmButton: false,
          width: '370px',
          customClass: {
            container: 'enjoei-modal-container-class',
            popup: 'enjoei-modal-popup-class',
            header: 'enjoei-modal-header-class',
            title: 'enjoei-modal-title-class',
            closeButton: 'enjoei-modal-close-button-class',
            image: 'enjoei-modal-image-class',
            content: 'enjoei-modal-content-class',
            input: 'enjoei-modal-input-class',
            actions: 'enjoei-modal-actions-class',
            confirmButton: 'enjoei-modal-confirm-button-class',
            cancelButton: 'enjoei-modal-cancel-button-class',
            footer: 'enjoei-modal-footer-class'
          }
        });
      }
    }]);

    return EnjoeiModal;
  }(); //ButtonScript


  var ActionButtons =
  /*#__PURE__*/
  function () {
    function ActionButtons() {
      _classCallCheck(this, ActionButtons);

      this.confirmButton = document.getElementById('confirm-button');
      this.cancelButton = document.getElementById('cancel-button');

      this._bind_click_buttons();
    }

    _createClass(ActionButtons, [{
      key: "confirm",
      value: function confirm() {
        var title = 'compra confirmada';
        var text = 'entraremos em contato po email';
        var modal = new EnjoeiModal(title, text);
        modal.fire();
      }
    }, {
      key: "cancel",
      value: function cancel() {
        var title = 'compra cancelada';
        var text = 'pedido não foi enviado, você não sera cobrado';
        var modal = new EnjoeiModal(title, text);
        modal.fire();
      }
    }, {
      key: "_bind_click_buttons",
      value: function _bind_click_buttons() {
        this.confirmButton.onclick = this.confirm;
        this.cancelButton.onclick = this.cancel;
      }
    }]);

    return ActionButtons;
  }(); //PathParamRouter


  var PathParam =
  /*#__PURE__*/
  function () {
    function PathParam() {
      _classCallCheck(this, PathParam);
    }

    _createClass(PathParam, null, [{
      key: "params",
      value: function params() {
        var array = window.location.pathname.split('/').filter(function (item) {
          return item !== "";
        });
        var result = {};

        for (var i = 0; i < array.length; i = i + 2) {
          result[array[i]] = array[i + 1];
        }

        return result;
      }
    }]);

    return PathParam;
  }(); //Summary


  var SummarySection =
  /*#__PURE__*/
  function () {
    function SummarySection(result) {
      var voucher_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      _classCallCheck(this, SummarySection);

      this.fields = {
        shippingPrice: result.checkout.shippingPrice,
        totalPrice: result.checkout.totalPrice,
        price: result.product.price,
        image: result.product.image,
        cupons: result.checkout.availableCoupons //the api doesnt say if voucher has applied

      };

      if (voucher_id && voucher_id != -1) {
        this.fields = _objectSpread({}, this.fields, {
          hasVoucher: true,
          voucher_id: voucher_id
        });
      }
    }

    _createClass(SummarySection, [{
      key: "printAll",
      value: function printAll() {
        var _this = this;

        this._print('amount-total', this.fields.totalPrice, {
          bold: true
        });

        this._print('amount-shipping', this.fields.shippingPrice);

        this._print('amount-original', this.fields.price); //if there are more one available voucher, find the correct


        if (this.fields.hasVoucher === true) {
          var cupom = this.fields.cupons.find(function (cupom) {
            return cupom.id == _this.fields.voucher_id;
          });

          this._print('amount-discount', cupom.discount * -1, {
            accent: true
          });
        } else {
          this._print('amount-discount', 0);
        }
      }
    }, {
      key: "_print",
      value: function _print(id, value) {
        var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var element = document.querySelector("#".concat(id));
        element.innerText = Util.formatMoney(value);
        element.className = '';
        if (opts.accent) element.classList.add("accent-text");
        if (opts.bold) element.classList.add("bold-text");
      }
    }]);

    return SummarySection;
  }(); //Cupons


  var CupomSection =
  /*#__PURE__*/
  function () {
    function CupomSection(cupons) {
      _classCallCheck(this, CupomSection);

      this.cupons = cupons;
      this.couponSectionList = document.getElementById('coupons-list');
      this.cupomAmountDetail = document.getElementById('amount-cupom-detail');

      if (!cupons || cupons.length === 0) {
        document.getElementById('coupon-section').classList.add("hide");
        this.couponSectionList.classList.add("hide");
        this.cupomAmountDetail.classList.add("hide");
        return;
      }

      this.cupons.unshift({
        id: -1,
        title: 'não usar cupom'
      });
    }

    _createClass(CupomSection, [{
      key: "printAvailables",
      value: function printAvailables() {
        var _this2 = this;

        var voucherOnScreen = document.querySelectorAll(".voucher-item").length; //return if all vouchers are on the screen

        if (voucherOnScreen === this.cupons.length) {
          return;
        }

        this.couponSectionList.innerHTML = "";
        this.cupons.forEach(function (cupom) {
          var html = _this2._print(cupom);

          _this2.couponSectionList.appendChild(html);
        });
      }
    }, {
      key: "bindChanges",
      value: function bindChanges() {
        document.querySelectorAll("input[name='voucher']").forEach(function (el) {
          el.onchange = function () {
            var voucher_id = document.querySelector("input[name='voucher']:checked").value;
            new LoadCheckoutPage(PathParam.params().checkout, voucher_id);
          };
        });
      }
    }, {
      key: "_print",
      value: function _print(cupom) {
        var div = document.createElement('div');
        var htmlString = "<div class=\"item-detail voucher-item\">\n        <label class=\"radio-button row x-between\">".concat(cupom.title, "\n        <input type=\"radio\" name=\"voucher\" value=\"").concat(cupom.id, "\">\n        <span class=\"checkmark\"></span>\n        <span class=\"accent-text\">").concat(Util.formatMoney(cupom.discount * -1), "</span>\n        </label>\n      </div>");
        div.innerHTML = htmlString.trim();
        return div.firstChild;
      }
    }]);

    return CupomSection;
  }(); //Load checkout page


  var LoadCheckoutPage =
  /*#__PURE__*/
  function () {
    function LoadCheckoutPage(checkout_id) {
      var voucher_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

      _classCallCheck(this, LoadCheckoutPage);

      this.checkout_id = checkout_id;
      this.voucher_id = voucher_id;
      this.hasVoucher = false;
      this.perform();
    }

    _createClass(LoadCheckoutPage, [{
      key: "perform",
      value: function perform() {
        var _this3 = this;

        var url = "/api/checkouts/".concat(this.checkout_id);

        if (this.voucher_id != -1) {
          url = url.concat("?couponId=".concat(this.voucher_id));
        }

        fetch(url).then(function (result) {
          return result.json();
        }).then(function (result) {
          var summarySection = new SummarySection(result, _this3.voucher_id);
          summarySection.printAll();
          var cupomSection = new CupomSection(result.checkout.availableCoupons);
          cupomSection.printAvailables();
          cupomSection.bindChanges();
        });
      }
    }]);

    return LoadCheckoutPage;
  }();

  $(document).ready(function () {
    new LoadCheckoutPage(PathParam.params().checkout);
    new ActionButtons();
  });
})();
//# sourceMappingURL=script.js.map
