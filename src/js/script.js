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

//PathParamRouter
class PathParam {
  static params() {
    const array = window.location.pathname.split('/').filter(item => item !== "")
    const result = {}
    for (let i = 0; i < array.length; i = i + 2) {
      result[array[i]] = array[i + 1];
    }
    return result;
  }
}

class PrintHtmlPage{
  constructor(id, value, opts = {}){
    this.value = value;
    this.opts = opts
    this.element = document.querySelector(`#${id}`)
  }

  show(){
    this.element.innerText = this._formatMoney(this.value)
    if(this.opts.accent)
      this.element.classList.add("accent-text");
      
    if (this.opts.bold) 
      this.element.classList.add("bold-text");
    
  }

 _formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    let j = (i.length > 3) ? i.length % 3 : 0;

    return `R$ ${negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "")}`;
  } catch (e) {
    console.log(e)
  }
}
}

//Load product checkout 
class LoadCheckoutPage{
  constructor(checkout_id){
    this.checkout_id = checkout_id;
    this.perform();
  }

  perform(){
    fetch(`/api/checkouts/${this.checkout_id}`)
      .then((result) => result.json())
      .then((result) => {
        const fields = {
          shippingPrice: result.checkout.shippingPrice,
          totalPrice: result.checkout.totalPrice,
          price: result.product.price,
          image: result.product.image
        }

        new PrintHtmlPage('amount-total', fields.totalPrice, { accent: true, bold: true }).show();
        new PrintHtmlPage('amount-shipping', fields.shippingPrice).show();
        new PrintHtmlPage('amount-original', fields.price).show();
        console.log(fields);
      })
  }
}

$(document).ready(() =>{
  new LoadCheckoutPage(PathParam.params().checkout);
  new ActionButtons();
})