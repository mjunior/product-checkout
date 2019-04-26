//ModalScript
class EnjoeiModal {
  constructor(title, text){
    this.title = title;
    this.text = text;
  }
  
  fire(){
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
}
//ButtonScript
class ActionButtons{
  constructor() {
    this.confirmButton = document.getElementById('confirm-button');
    this.cancelButton = document.getElementById('cancel-button');
    this._bind_click_buttons();
  }

  confirm() {
    const title = 'compra confirmada';
    const text = 'entraremos em contato po email';
    const modal = new EnjoeiModal(title, text)
    modal.fire()
  }

  cancel() {
    const title = 'compra cancelada';
    const text = 'pedido não foi enviado, você não sera cobrado'
    const modal = new EnjoeiModal(title,text)
    modal.fire()
  }

  _bind_click_buttons(){
    this.confirmButton.onclick = this.confirm
    this.cancelButton.onclick = this.cancel
  }
}

$(document).ready(() =>{
  new ActionButtons();
})