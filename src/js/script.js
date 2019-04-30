(function(){
  class Util{
    static formatMoney(amount, decimalCount = 2, decimal = ",", thousands = ".") {
      if(isNaN(amount)){  
        return ""
      }
      const format = { minimumFractionDigits: 2, style: 'currency', currency: 'BRL' }
      return amount.toLocaleString('pt-BR', format);
    }
  }
  //ModalScript
  class EnjoeiModal {
    constructor(title, text,icon){
      this.title = title;
      this.text = text;
      this.modal_icon = icon
    }
    
    fire(){
      let width = `${document.querySelector('.container').offsetWidth - 80}px`

      Swal.fire({
        title: this.title || 'compra efetuada',
        text: this.text || 'enviaremos informacoes por email',
        showCloseButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        imageUrl: `/public/images/cart-${this.modal_icon}.png`,
        imageHeight: 25,
        width: width,
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
      const checkout_id = PathParam.params().checkout
      let url = `/api/checkouts/${checkout_id}`
      fetch(url, { method: 'POST' })
        .then((result) => result.json())
        .then((result) => {
          if(result.status === 'success'){
            const title = 'compra confirmada';
            const text = 'enviaremos atualizações sobre o pedido para o seu email';
            const modal = new EnjoeiModal(title, text, 'success')
            modal.fire()
          }
        })
    }

    cancel() {
      const title = 'compra cancelada';
      const text = 'o pedido não foi enviado e você não será cobrado'
      const modal = new EnjoeiModal(title,text,'cancel')
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
  //Summary
  class SummarySection{
    constructor(result, voucher_id = -1){
      this.fields = {
        shippingPrice: result.checkout.shippingPrice,
        totalPrice: result.checkout.totalPrice,
        price: result.product.price,
        image: result.product.image,
        cupons: result.checkout.availableCoupons
      }
      //the api doesnt say if voucher has applied
      if (voucher_id && voucher_id != -1) {
        this.fields = {
          ...this.fields,
          hasVoucher: true,
          voucher_id: voucher_id
        }
      }
    }

    printAll(){
      this._print('amount-total', this.fields.totalPrice, { bold: true });
      this._print('amount-shipping', this.fields.shippingPrice);
      this._print('amount-original', this.fields.price);

      //if there are more one available voucher, find the correct
      if(this.fields.hasVoucher === true){
        const cupom = this.fields.cupons.find(cupom => {
          return cupom.id == this.fields.voucher_id
        })
        
        this._print('amount-discount', cupom.discount * -1,{accent: true});
      }else{
        this._print('amount-discount', 0);
      }
    }
    
    _print(id, value, opts = {}){
      const element = document.querySelector(`#${id}`)
      element.innerText = Util.formatMoney(value)
      element.className = '';

      if(opts.accent)
        element.classList.add("accent-text");
        
      if (opts.bold) 
        element.classList.add("bold-text");
    }
  }

  //Cupons
  class CupomSection{
    constructor(cupons){
      this.cupons = cupons;
      this.couponSectionList = document.getElementById('coupons-list');
      this.cupomAmountDetail = document.getElementById('amount-cupom-detail');
      if(!cupons || cupons.length === 0){
        document.getElementById('coupon-section').classList.add("hide")
        this.couponSectionList.classList.add("hide");
        this.cupomAmountDetail.classList.add("hide");
        return
      }

      this.cupons.unshift({
        id: -1,
        title: 'não usar cupom'
      })
    }
    
    printAvailables(){
      const voucherOnScreen = document.querySelectorAll(".voucher-item").length
      //return if all vouchers are on the screen
      if(voucherOnScreen === this.cupons.length){
        return
      }
      this.couponSectionList.innerHTML = ""
      this.cupons.forEach(cupom => {
        let html = this._print(cupom)
        this.couponSectionList.appendChild(html)
      });
    }

    bindChanges(){
      document.querySelectorAll("input[name='voucher']").forEach(function (el) {
        el.onchange = function(){
          const voucher_id = document.querySelector("input[name='voucher']:checked").value
          new LoadCheckoutPage(PathParam.params().checkout, voucher_id);
        }
      })
    }
    
    _print(cupom){
      const div = document.createElement('div');
      const htmlString = `<div class="item-detail voucher-item">
        <label class="radio-button row x-between">${cupom.title}
        <input type="radio" name="voucher" value="${cupom.id}">
        <span class="checkmark"></span>
        <span class="accent-text">${Util.formatMoney(cupom.discount * -1)}</span>
        </label>
      </div>`
      div.innerHTML = htmlString.trim();
      return div.firstChild
    }
  }

  //Picture
  class PictureSection{
    constructor(url){
      this.url = url
      this.imageEl = document.getElementById('image');
    }

    show(){
      this.imageEl.src = this.url
    }
  }

  //Load checkout page
  class LoadCheckoutPage{
    constructor(checkout_id, voucher_id = -1){
      this.checkout_id = checkout_id;
      this.voucher_id = voucher_id;
      this.hasVoucher = false;
      this.perform();
    }

    perform(){
      let url = `/api/checkouts/${this.checkout_id}`
      if(this.voucher_id != -1){
        url = url.concat(`?couponId=${this.voucher_id}`);
      }
      fetch(url)
        .then((result) => result.json())
        .then((result) => {
          const summarySection  = new SummarySection(result, this.voucher_id)
          summarySection.printAll();

          const cupomSection = new CupomSection(result.checkout.availableCoupons)
          cupomSection.printAvailables();
          cupomSection.bindChanges();

          const pictureSection = new PictureSection(result.product.image)
          pictureSection.show();
        })
    }
  }

  $(document).ready(() =>{
    new LoadCheckoutPage(PathParam.params().checkout);
    new ActionButtons();
  })
})();