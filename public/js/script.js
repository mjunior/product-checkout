"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//ModalScript
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
}();

var PrintHtmlPage =
/*#__PURE__*/
function () {
  function PrintHtmlPage(id, value) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, PrintHtmlPage);

    this.value = value;
    this.opts = opts;
    this.element = document.querySelector("#".concat(id));
  }

  _createClass(PrintHtmlPage, [{
    key: "show",
    value: function show() {
      this.element.innerText = this._formatMoney(this.value);
      if (this.opts.accent) this.element.classList.add("accent-text");
      if (this.opts.bold) this.element.classList.add("bold-text");
    }
  }, {
    key: "_formatMoney",
    value: function _formatMoney(amount) {
      var decimalCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      var decimal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ",";
      var thousands = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ".";

      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        var negativeSign = amount < 0 ? "-" : "";
        var i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        var j = i.length > 3 ? i.length % 3 : 0;
        return "R$ ".concat(negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : ""));
      } catch (e) {
        console.log(e);
      }
    }
  }]);

  return PrintHtmlPage;
}(); //Load product checkout 


var LoadCheckoutPage =
/*#__PURE__*/
function () {
  function LoadCheckoutPage(checkout_id) {
    _classCallCheck(this, LoadCheckoutPage);

    this.checkout_id = checkout_id;
    this.perform();
  }

  _createClass(LoadCheckoutPage, [{
    key: "perform",
    value: function perform() {
      fetch("/api/checkouts/".concat(this.checkout_id)).then(function (result) {
        return result.json();
      }).then(function (result) {
        var fields = {
          shippingPrice: result.checkout.shippingPrice,
          totalPrice: result.checkout.totalPrice,
          price: result.product.price,
          image: result.product.image
        };
        new PrintHtmlPage('amount-total', fields.totalPrice, {
          accent: true,
          bold: true
        }).show();
        new PrintHtmlPage('amount-shipping', fields.shippingPrice).show();
        new PrintHtmlPage('amount-original', fields.price).show();
        console.log(fields);
      });
    }
  }]);

  return LoadCheckoutPage;
}();

$(document).ready(function () {
  new LoadCheckoutPage(PathParam.params().checkout);
  new ActionButtons();
});
//# sourceMappingURL=script.js.map
