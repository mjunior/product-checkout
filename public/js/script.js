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
}();

$(document).ready(function () {
  new ActionButtons();
});
//# sourceMappingURL=script.js.map
