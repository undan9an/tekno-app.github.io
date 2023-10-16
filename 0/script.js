let urlDB;
const indexUrl = 0;
let sheetID;
const sheetIndex = 0;


const kecamatan = document.getElementById('kecamatan').classList.value;
document.getElementById('title').textContent = kecamatan+' App';
document.getElementById('title2').textContent = kecamatan+' App';
document.getElementById('title3').innerHTML =`<img src="../0/icon.png" style="height:1.5em"> `+kecamatan+' App';
const laporKec = document.getElementById('laporKec');
laporKec.value = kecamatan;


const searchBtn = document.querySelector(".searchBtn");
let koneksi = false;

const searchInput = document.querySelector(".searchInput");
const saran = document.querySelector(".saran");

searchInput.onkeyup = (e) => {
  if (e.keyCode != 13 && searchInput.value) {
    liveSearch(searchInput.value.toLowerCase());
  } else if (e.keyCode == 13) {
    searchBtn.click();
  } else if (!searchInput.value) {
    saran.classList.remove("show");
  }
};

let keys = [];

function liveSearch(value) {
  const dataA = keys.filter((a) => a.toLowerCase().includes(value));
  const dataB = dataA.sort(() => Math.random() - 0.5);
  if (dataB.length < 1) {
    saran.classList.remove("show");

    return;
  }
  let saran = "";
  for (let i = 0; dataB.length > 5 ? i < 5 : i < dataB.length; i++) {
    saran += `<li><a class="dropdown-item saran-cari">${dataB[i]}</a></li>`;
  }
  if (!koneksi) {
    saran.innerHTML = saran;
    if (!saran.classList.contains("show")) {
      saran.classList.add("show");
    }
  }

  saran.onclick = (e) => {
    if (e.target.classList.contains("saran-cari")) {
      searchInput.value = e.target.textContent;
      searchBtn.click();
    }
  };
}

let all;
let info;
let jmlBlue = [];
const now = new Date();
let index = false;
let datax;
const harga = document.getElementById('harga');
const transferKe = document.getElementById('transferKe');
const iklan = document.getElementById('iklan');
const callAdmin = document.getElementById('callAdmin');
const hasilcari = document.querySelector(".hasilcari");

function dataX(){
  let daftarHarga = `<option value="">~ Pilihan paket centang biru ~</option>`;
  let daftarTransfer = `<option value="">~ Pilihan tujuan transfer ~</option>`;
  fetch('../0/data.json?x='+new Date().getTime())
    .then((respon) => respon.json())
    .then(r=>{
      datax = r;
      urlDB = r.urlDB[indexUrl];
      sheetID = r.sheetID[sheetIndex];
      for(let i = 0; i<r.harga.length;i++){
        daftarHarga += `<option value="${r.harga[i][0]}/${i}">Rp. ${r.harga[i][0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} / ${r.harga[i][1]}</option>`;
      }
      harga.innerHTML = daftarHarga;
      
      for(let j = 0;j<r.transfer.length;j++){
        daftarTransfer += `<option value="${r.transfer[j][0]}/${j}">${r.transfer[j][0]}</option>`
      }
      transferKe.innerHTML = daftarTransfer;
      if(r.info != ''){
      iklan.innerHTML = r.info;
      if(!iklan.classList.contains('border')){
        iklan.classList.add('border');
      }
      }
      callAdmin.onclick = ()=>{
        location.href = "https://api.whatsapp.com/send?phone="+r.nomoradmin+'&text=Halo%20Admin,%20Saya%20sudah%20melakukan%20pembayaran%20untuk%20aktivasi%20centang%20biru.%0A%0A*KODE AKTIVASi*%3A%0Ahttp://www.localhost:8080/admin%23'+indexUrl+'%23'+sheetIndex+'%23'+kecamatan+'%23'+all[index][0]+'%0A%0AHarap untuk segera diproses, terimakasih.';
      }
      searchBtn.click();
    })
    .catch(err=>{
      koneksi = false;
      hasilcari.innerHTML = `<div class="alert alert-danger alert-dismissible fade show d-flex px-0 justify-content-center align-items-center my-1 mx-auto" role="alert" style="width:80%;flex-direction:column">
          <strong>Terjadi error!</strong><span>Koneksi bermasalah</span></div>`;
          if(searchBtn.classList.contains("disabled")){
      searchBtn.classList.toggle("disabled");
          }
      searchBtn.textContent = "Cari";
    });
}

function Info(){
  if(all.length > 101){
          info =`<div class="my-1">
<div class="card">
${datax.info}
<div class="card-body pb-0">
  <blackquote class="text-secondary">
    <p class="text-center">~ Bingung mau cari apa?</p>
  </blackquote>
  <p class="text-center"><button class="btn bg-white btn-outline-success" id="semua" onclick="searchInput.value = 'tampil 100 data',
searchBtn.click()">tampilkan 100 data</button></p>
</div>
</div>
</div>`;
        }else{
          info = `<div class="my-1">
<div class="card overflow-hidden">
${datax.info}
<div class="card-body pb-0">
  <blackquote class="text-secondary">
    <p class="text-center">~ Belum banyak yang bisa dicari</p>
  </blackquote>
  <p class="text-center"><button class="btn bg-white btn-outline-success" id="semua" onclick="searchInput.value = 'tampil semua',
searchBtn.click()">tampil semua</button></p>
</div>
</div>
</div>`;
          
          
        }
}

async function loadAwal(){
  try {
      hasilcari.innerHTML = "";
      all = await ambilData();
      Info();
      
      jmlBlue = [];
      all.forEach((a,i)=>{
        if(i > 0){
          
          if (all[i][12]) {
      let biru = all[i][12].split('#');

      biru = new Date(biru[2], biru[1] - 1, parseInt(biru[0])+1);
      
      if (now.getTime() < biru.getTime()) {
        jmlBlue.push(i);
        
      } 
    }
        }

      });
      
      if(searchBtn.classList.contains("disabled")){
      searchBtn.classList.toggle("disabled");
      }
      searchBtn.textContent = "Cari";
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
      
      if(document.cookie && parseInt(document.cookie.split('X')[0]) > 0){
        formjudul.textContent = 'Formulir Edit';
        daftarprofil.textContent = 'Profil';
        index = parseInt(document.cookie.split('X')[0]);
        loadEdit(index);
      }
   
      
      if (searchInput.value.toLowerCase() == "update") {
        hasilcari.innerHTML =
          `<div class="alert alert-success alert-dismissible fade show d-flex px-0 justify-content-center my-1 mx-auto" role="alert" style="width:80%">
          Update berhasil!</div>` + info;
          randomData();
        return 'return';
      } else if (searchInput.value.toLowerCase() == "perbarui") {
        hasilcari.innerHTML =
          `<div class="alert alert-success alert-dismissible fade show d-flex px-0 justify-content-center my-1 mx-auto" role="alert" style="width:80%">
          Berhasil diperbarui!</div>` + info;
          randomData();
        return 'return';
      } else if (!searchInput.value) {
        
        
        hasilcari.innerHTML = info;
        randomData();
        return 'return';
      }
    } catch (err) {
      
      koneksi = false;
      if (searchInput.value) {
        alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
        eror.click();
      }
      hasilcari.innerHTML = `<div class="alert alert-danger alert-dismissible fade show d-flex px-0 justify-content-center align-items-center my-1 mx-auto" role="alert" style="width:80%;flex-direction:column">
          <strong>Terjadi error!</strong><span>Koneksi bermasalah</span></div>`;
          if(searchBtn.classList.contains("disabled")){
      searchBtn.classList.toggle("disabled");
          }
      searchBtn.textContent = "Cari";
      return 'return';
    }
}

const formjudul = document.querySelector('.formjudul');
const daftarprofil = document.querySelector('.daftarprofil');
const eror = document.getElementById("eror");
const alertEror = document.querySelector(".alert-eror");

searchBtn.onclick = async function (e) {
  e.preventDefault();
  if (saran.classList.contains("show")) {
    saran.classList.remove("show");
  }

  if (
    all == undefined ||
    searchInput.value.toLowerCase() == "update" ||
    searchInput.value.toLowerCase() == "perbarui"
  ) {

  if(!e.target.classList.contains("disabled")){

    e.target.classList.toggle("disabled");
  
    e.target.innerHTML = `<div class="spinner-border text-white spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
}
    if(urlDB == undefined){
      return dataX();
    }

    const lA = await loadAwal();
    if(lA == 'return'){
      return;
    }
  } else if (!searchInput.value || koneksi) {
    return;
  }
  
  if(searchInput.value.toLowerCase() != "tampil semua" && searchInput.value.toLowerCase() != "update" && searchInput.value.toLowerCase() != "perbarui"){
    if(keys.indexOf(searchInput.value.toLowerCase()) < 0){
  keys.unshift(searchInput.value);
  if(keys.length > 9){
    keys.pop();
  }
    }
  }

  hasilcari.innerHTML = "";
  e.target.classList.toggle("disabled");
  e.target.innerHTML = `<div class="spinner-border text-white spinner-border-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`;
let data;
  if (searchInput.value.toLowerCase() == "tampil semua" || searchInput.value.toLowerCase() == 'tampil 100 data') {
    
    data = [];
  all.forEach((a,i)=>{
    if(i>0){
      data.unshift(a)
   }
  });
  } else {
    data = all.filter(a => a[5].toLowerCase().includes(searchInput.value.toLowerCase()) || a[6].toLowerCase().includes(searchInput.value.toLowerCase()) || a[8].toLowerCase().includes(searchInput.value.toLowerCase()) || a[10].toLowerCase().includes(searchInput.value.toLowerCase()) || a[11].toLowerCase().includes(searchInput.value.toLowerCase()));
  }

  setTimeout(() => {
    e.target.classList.toggle("disabled");
    e.target.textContent = "Cari";
    if (data.length < 1) {
      hasilcari.innerHTML =
        `<div class="alert alert-danger alert-dismissible fade show d-flex  px-0 justify-content-center my-1 mx-auto" role="alert" style="width:80%">
        Tidak ditemukan!</div>` + info;
      return;
    }

    tampilData(data);
  }, 300);
};

function randomData(){

  if(all.length > 6){
    
   const data = [];
  all.forEach((a,i)=>{
    if(i>0 && !jmlBlue.includes(i)){
  
      data.unshift(a)
  
   }
  });

    tampilData(data,true);
  }
}

function ambilData() {
  koneksi = true;
  return fetch(urlDB,{method: "POST",body: JSON.stringify({SHEETID:sheetID,SHEETNAME:kecamatan,FN:"READ"})})
    .then((respon) => {
      if (!respon.ok) {
        koneksi = false;
        throw new Error(respon.statusText.toLowerCase());
      }
      return respon.json();
    })
    .then((respon) => {
      koneksi = false;
      return respon;
    });
}

function setCookie(cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cvalue + ";" + expires + ";path=/";
}


function tampilData(data,x) {
  
  data.sort(() => Math.random() - 0.5);
  if(x == true && jmlBlue.length >= 0){
    jmlBlue.sort(() => Math.random() - 0.5);
   for(let h = 0;h < jmlBlue.length;h++){
        data.unshift(all[jmlBlue[h]]);
      }
  }
  let centang;
  let jml = 0;
  let blue = 0;
  let centangimg;
  let bercentang = "";
  let hasil = "";
  

  for (let i = 0; data.length > 100 ? i < 100 : i < data.length; i++) {
    centang = false;
    centangimg = 'd-none';
    if (data[i][12]) {
      let biru = data[i][12].split('#');

      biru = new Date(biru[2], biru[1] - 1, parseInt(biru[0])+1);
      
      if (now.getTime() < biru.getTime()) {
        centang = true;
        centangimg = '';
      } else {
    
        centang = false;
      }
    }

    const isi = `
        <div class="my-1">
          <div class="card">

            <div class="card-body position-relative">
              <h6 class="card-title" style="font-size:1.07em"><span class="judul${i}"></span><img class="${centangimg}" src="../0/centang.png" style="height:1em;"></h6>
              <h6 class="card-subtitle mb-2 text-muted nama${i}" style="font-size: .9em"></h6>
              <p class="card-text lh-sm fst-italic mb-1 deskripsi${i}"></p>
              <span class="position-absolute top-0 start-0 end-0 bottom-0 d-flex justify-content-end px-1 pt-1 disabled lihat" data-index="${i}" data-centang="${centang}" style="opacity:.5"></span>
            </div>
          </div>
        </div>
      `;
    
    jml+=1;
    if (centang == false) {
      hasil += isi;
    } else {
      blue += 1;
      bercentang += isi;
    }
    
    if(x == true && blue > 4 && jmlBlue.length >=5){
        i = 99;
        
      }else if(x==true && jml > 4 && jmlBlue.length < 5){
        i = 99;
      }
  }

  if(x == true && jmlBlue.length >= 5){
    hasilcari.innerHTML += bercentang;
  }else if(x == true){
  hasilcari.innerHTML += bercentang + hasil;
  }else if (jml > 100) {
    hasilcari.innerHTML = `<h6 class="card-subtitle mt-2 text-muted fst-italic text-center">Menampilkan 100 dari total ${data.length}</h6>`+ bercentang + hasil;
  }else{
  hasilcari.innerHTML = bercentang + hasil;
  }

  for(let j = 0;j<jml;j++){
    
    document.querySelector('.judul'+j).textContent = data[j][5]+' ';
    document.querySelector('.nama'+j).textContent = data[j][6];
    document.querySelector('.deskripsi'+j).textContent = data[j][10].slice(0,140)+'...';
  }
  
  hasilcari.onclick = (e) => {
    if (!e.target.classList.contains("lihat") || koneksi) {
      return;
    }

    e.target.classList.toggle("bg-light");
    e.target.innerHTML = `
  <span class="spinner-border text-secondary spinner-border-sm" role="status" aria-hidden="true"></span>
  <span class="visually-hidden">Loading...</span>`;
  
    lihatdata(data[e.target.dataset.index], e.target, e.target.dataset.centang);
  };
}

const lihatData = document.querySelector(".lihat-data");
let modalClick;
const imgx = document.querySelector(".imgX img");
const laporID = document.getElementById("laporID");
const laporJudul = document.getElementById('laporJudul');
function lihatdata(data, text, centang) {
  koneksi = true;
  topBarToggler.dataset.bsTarget = '';
  let order;
  if (data[9].split(" ")[0] == "antar") {
    data[9].split(" ")[1] == "1"
      ? (order = "Pesan antar / delivery order? ✅")
      : (order = "Pesan antar / delivery order? ❌");
  } else {
    data[9].split(" ")[1] == "1"
      ? (order = "Bisa dipanggil ke tempat pelanggan? ✅")
      : (order = "Bisa dipanggil ke tempat pelanggan? ❌");
  }

  document.querySelector(".lihatjudul").textContent = data[5]+' ';
  if (centang == "true") {
    document.querySelector(".imgcentang").classList.remove('d-none');
  } else if(!document.querySelector(".imgcentang").classList.contains('d-none')){
    document.querySelector(".imgcentang").classList.add('d-none');
  }
  document.querySelector(".lihatnama").textContent = data[6];
  document.querySelector(".lihatjam").textContent = "⏰ " + data[7];
  document.querySelector(".lihatlokasi").textContent = "🏡 " + data[8];
  document.querySelector(".lihatorder").textContent = "🛵 " + order;
  let des= '';
  if(data[10].includes("\n")){
    const barisBaru = data[10].split("\n");
    
    barisBaru.forEach((x,i)=>{
      des += x+"\n";
    });
  }else{
    des = data[10];
  }
  document.querySelector(".lihatdeskripsi").textContent = des;
  document.querySelector(".hubungi").onclick = () => {
    location.href = "https://api.whatsapp.com/send?phone=" + data[1];
  };

  const a = setTimeout(() => {
    koneksi = false;
    topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
    text.classList.toggle("bg-light");
    text.textContent = "";
    alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
    eror.click();
  }, 90000);

  function diload() {
   // koneksi = false;
   topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
    lihatData.style.transform = "translateX(-100%)";
    setTimeout(() => {
      text.classList.toggle("bg-light");
      text.textContent = "";
    }, 1000);
    clearTimeout(a);

    lihatData.classList.replace("a", "b");
    window.history.pushState(0, null, "");
  }
  
  const gambar = document.querySelector(".card-img-top");
  const foto = document.querySelector(".foto");

  function loadimg(gambarsrc, fotosrc) {
    gambar.src = gambarsrc;
    gambar.onload = (e) => {
      if (e.target.width > e.target.height) {
        e.target.style.width = "auto";
      } else {
        e.target.style.height = "auto";
      }
      
      foto.src = fotosrc;
      foto.onload = (e) => {
        if (e.target.height < e.target.width) {
        foto.style.height = "100%";
        foto.style.width = "auto";
      } else {
        foto.style.width = "100%";
        foto.style.height = "auto";
      }
        diload();
      };
    };
  }

    loadimg(data[3], data[4]);

  document.querySelector(".img").onclick = (e) => {
    if (
      !e.target.src ||
      e.target.classList.contains("waIcon") ||
      e.target.classList.contains("titik")
    ) {
      return;
    }
    imgx.src = e.target.src;
    imgx.onload = (x) => {
      if (x.target.height - x.target.width > x.target.width) {
        imgx.style.height = "95vh";
        imgx.style.width = "auto";
      } else {
        imgx.style.height = "auto";
        imgx.style.width = "100%";
      }
    };
    modalClick = e.target;
  };
  
  imgx.onclick =e=>{
  modalClick.click();
}

  document.querySelector(".lapor").onclick = (e) => {
    modalClick = e.target;
    laporID.value = data[1];
    laporJudul.value = data[5];
  };

  

}

const main = document.querySelector(".beranda");
// Get the button
const mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
main.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (main.scrollTop > 300) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  main.scrollTo({ top: 0, behavior: "smooth" });
}

function onlyNumberKey(evt) {
  // Only ASCII character in that range allowed
  var ASCIICode = evt.which ? evt.which : evt.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
  return true;
}

const pelapor = document.getElementById('pelapor');

pelapor.onkeyup = e=>{
  if(e.target.value[0] != '+' || e.target.value[1] != 6 || e.target.value[2] != 2){
    e.target.value = '+62';
  }
}

const kirimlapor = document.querySelector(".kirim-lapor");
const kirimLapor = document.getElementById("kirimLapor");
const batallapor = document.querySelector(".batal");

const keluhan = document.getElementById('keluhan');
const laporForm = document.querySelector(".laporForm");
const laporOK = document.querySelector(".lapor-ok");

const formLapor = document.forms["lapor"];
formLapor.onsubmit = (e) => {
  e.preventDefault();
  if (kirimlapor.classList.contains('a')) {
    return;
  }
  kirimlapor.classList.toggle("d-none");
  kirimLapor.classList.toggle("d-none");
  batallapor.classList.toggle("disabled");
  
  const obj ={
    SHEETID : sheetID,
    SHEETNAME : 'Laporan',
    FN : 'LAPOR',
    data : [
      laporKec.value,
      laporID.value,
      laporJudul.value,
      pelapor.value,
      keluhan.value
      ]
  }

  fetch(urlDB, { method: "POST", body: JSON.stringify(obj) })
    .then((r) => r.text())
    .then((response) => {
      
      kirimlapor.classList.toggle("d-none");
      kirimLapor.classList.toggle("d-none");
      batallapor.classList.toggle("disabled");

      batallapor.classList.toggle("d-none");
      if(response == 'lapor ok'){
      kirimlapor.classList.replace("btn-primary", "btn-success");
      kirimlapor.textContent = "oke";
      kirimlapor.classList.toggle('a');

      laporForm.classList.toggle("d-none");
      laporOK.classList.toggle("d-none");
      laporOK.classList.toggle("alert-success");
      laporOK.innerHTML = `<strong>Terimakasih</strong><br>Laporan berhasil dikirim`;
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }else{
        kirimlapor.classList.replace("btn-primary", "btn-danger");
      kirimlapor.textContent = "oke";
      kirimlapor.classList.toggle('a');

      laporForm.classList.toggle("d-none");
      laporOK.classList.toggle("d-none");
      laporOK.classList.toggle("alert-danger");
      laporOK.innerHTML = `<strong>Terjadi error!</strong><br>Laporan gagal dikirim`;
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }
    })
    .catch((error) => {
      kirimlapor.classList.toggle("d-none");
      kirimLapor.classList.toggle("d-none");
      batallapor.classList.toggle("disabled");

      batallapor.classList.toggle("d-none");
      kirimlapor.classList.replace("btn-primary", "btn-danger");
      kirimlapor.textContent = "oke";
      kirimlapor.classList.toggle('a');

      laporForm.classList.toggle("d-none");
      laporOK.classList.toggle("d-none");
      laporOK.classList.toggle("alert-danger");
      laporOK.innerHTML = `<strong>Terjadi error!</strong><br>Laporan gagal dikirim`;
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    });
};

batallapor.onclick = (e) => {
  if (!kirimlapor.classList.contains('a')) {
    keluhan.value = "";
    pelapor.value = "";
  }
};

kirimlapor.onclick = (e) => {
  if (e.target.classList.contains('a')) {
    batallapor.click();
    setTimeout(() => {
      e.target.textContent = "Kirim";
      e.target.classList.toggle('a');
      batallapor.classList.toggle("d-none");
      laporForm.classList.toggle("d-none");
      laporOK.classList.toggle("d-none");
      if (
        laporOK.classList.contains("alert-success")
      ) {
        kirimlapor.classList.replace("btn-success", "btn-primary");
        laporOK.classList.toggle("alert-success");
        keluhan.value = "";
        pelapor.value = "";
      } else if (
        laporOK.classList.contains("alert-danger")
      ) {
        kirimlapor.classList.replace("btn-danger", "btn-primary");
        laporOK.classList.toggle("alert-danger");
      }
    }, 800);
  }
};

const topBar = document.querySelector(".navbar-nav");
const topBarToggler = document.querySelector(".navbar-toggler");
const daftaredit = document.querySelector('.daftaredit');
const centangPage = document.querySelector('.centangPage');

topBarToggler.onclick = (e) => {
  if (!topBarToggler.classList.contains("collapsed")) {
    window.history.pushState(0, null, "");
  }else if(!daftaredit.classList.contains('a') || lihatData.classList.contains("b") || !centangPage.classList.contains('a')){
  }else{
    history.back();
  }
};

const utamaDiv = document.querySelectorAll(".utama > div");

topBar.onclick = (e) => {
  if (!e.target.value) {
    return;
  }
  utamaDiv[topBar.classList.item(3)].classList.add("a");
  utamaDiv[e.target.value].classList.remove("a");
  

  if (lihatData.classList.contains("b") || !daftaredit  || !centangPage.classList.contains('a')) {
    history.back();
    history.back();
    
  }
  
  topBar.classList.replace(topBar.classList.item(3), e.target.value);
};

document.body.onclick = (e) => {
  if (
    !e.target.classList.contains("container-fluid") &&
    !e.target.classList.contains("nav-link") &&
    document.getElementById("navbarNavAltMarkup").classList.contains("show")
  ) {
   
    topBarToggler.click();
  } else if (saran.classList.contains("show")) {
    saran.classList.remove("show");
  }
};

const kembali = document.querySelector('.kembali');
const centangBack = document.querySelector('.centangback');
const daftarLogin = document.querySelector('.daftarlogin');
const editCentang = document.querySelector('.editCentang');

window.addEventListener("popstate", () => {
  if (
    document.querySelector(".imgX").classList.contains("show") ||
    document.getElementById("exampleModal").classList.contains("show")
  ) {
    if (
      !kirimlapor.classList.contains("d-none") &&
      kirimlapor.classList.contains('a')
    ) {
      kirimlapor.click();
    } else if (
      kirimLapor.classList.contains("d-none")
    ) {
      modalClick.click();
      keluhan.value = "";
      pelapor.value = "";
    }

    window.history.pushState(0, null, "");
  } else if (
    document.getElementById("exampleModal2").style.display == "block"
  ) {
    eror.classList.remove("a");
    eror.classList.add("x");
    eror.click();
  } else if (!topBarToggler.classList.contains("collapsed")) {
    topBarToggler.click();
  } else if (lihatData.classList.contains("b")) {
    lihatData.style.transform = "none";
    lihatData.classList.replace("b", "a");
    setTimeout(()=>{
      document.querySelector(".card-img-top").src = '';
      document.querySelector(".foto").src = '';
      koneksi = false;
    },1000);
  }else if(kembali.classList.contains('scale0') || centangBack.classList.contains('scale0')){
    window.history.pushState(0, null, "");
  }else if(daftaredit.classList.contains("daftar")){
    daftaredit.classList.toggle('daftar');
    daftaredit.classList.toggle('a');
    if(simpanOK.classList.contains('a')){
    daftarLogin.classList.toggle('a');
    iklan.classList.toggle('d-none');
    }
  }else if(daftaredit.classList.contains('edit')){
    daftaredit.classList.toggle('edit');
    daftaredit.classList.toggle('a');
    if(simpanOK.classList.contains('a')){
      editCentang.classList.toggle('a');
      iklan.classList.toggle('d-none');
    }
  }else if(!centangPage.classList.contains('a')){
    editCentang.classList.toggle('a');
    centangPage.classList.toggle('a');
    iklan.classList.toggle('d-none');
  }
});


document.querySelector('.daftarbtn').onclick = e=>{
  daftaredit.classList.toggle('a');
  daftaredit.classList.toggle('daftar');
  daftarLogin.classList.toggle('a');
  iklan.classList.toggle('d-none');
  window.history.pushState(0, null, "");
}

document.querySelector('.daftarback').onclick = e=>{
  e.preventDefault();
  history.back();
}

const nowa = document.getElementById("noWA");
const judul = document.getElementById("judul");
const nama = document.getElementById("nama");
const jam = document.getElementById("jam");
const lokasi = document.getElementById("lokasi");
const deskrip = document.getElementById("deskripsi");
const kunci = document.getElementById('kunci');
const resetGambar = document.querySelector('.resetGambar');
const resetFoto = document.querySelector('.resetFoto');
const divAktivasi = document.getElementById('divAktivasi');
const statusCentang = document.getElementById('statusCentang');
const ssReview = document.getElementById('ssReview');
const infoHarga = document.querySelector('.infoHarga');
const nextAktivasi = document.getElementById('nextAktivasi');

const bulan = ['','Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function loadEdit(i){
  if(editCentang.classList.contains('a')){
  daftarLogin.classList.toggle('a');
  editCentang.classList.toggle('a');
  }
  pwEdit();
  nowa.value = '+'+all[i][1];
  judul.value = all[i][5];
  nama.value  = all[i][6];
  jam.value  = all[i][7];
  lokasi.value  = all[i][8];
  if(all[i][9].split(' ')[0] == 'antar'){
    document.getElementById('barang').click();
  }else if(all[i][9].split(' ')[0] == 'panggil'){
    document.getElementById('jasa').click();
  }
  if(all[i][9].split(' ')[1] == '1'){
    document.getElementById(all[i][9].split(' ')[0]).click();
  }
  deskrip.value  = all[i][10];
  kunci.value  = all[i][11];
  
  resetGambar.dataset.src = all[i][3];
  resetGambar.click();
  resetFoto.dataset.src = all[i][4];
  resetFoto.click();

  if(document.cookie.split('X')[1] && document.cookie.split('X')[1] != all[i][12] && callAdmin.classList.contains('a')){
    divAktivasi.classList.toggle('a');
    callAdmin.classList.toggle('a');
      
  }
  
  if(jmlBlue.includes(i) && statusCentang.classList.contains('alert-danger')){
    
    statusCentang.classList.replace('alert-danger','alert-success');
    const exp = all[i][12].split('#');
    statusCentang.innerHTML = `<strong>Centang biru aktif!</strong><div>Berakhir pada: ${exp[0]+' '+bulan[exp[1]]+' '+exp[2]}</div>`;
    document.getElementById('petunjukAktivasi').textContent = 'Tambah masa aktif ?';
  }
  
  if(all[i][12] != '' && document.cookie.split('X')[1] == all[i][12]){
    setCookie(i+'X',365);
    const exp2 = all[i][12].split('#');
    statusCentang.innerHTML = `<strong>Centang biru aktif!</strong><div>Berakhir pada: ${exp2[0]+' '+bulan[exp2[1]]+' '+exp2[2]}</div>`;
    document.getElementById("aktivasiForm").reset();
    ssReview.src = '';
    infoHarga.textContent = '';
    if(!nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
    }
    divAktivasi.classList.toggle('a');
    callAdmin.classList.toggle('a');
  }
  
}

const idGambar = document.getElementById('gambar');
const gambarReview = document.getElementById('gambarReview');
const xGambar = document.getElementById('xGambar');

let dataGambar;
document.getElementById('pilihGambar').onclick = e=>{
  e.preventDefault();
  idGambar.click();
}

idGambar.onchange = async function(){
  if(!this.files[0] && xGambar.value){
    return;
  }
  
  dataGambar = await resizeIMG(this.files[0],document.getElementById('gambarX'));
  gambarReview.src = dataGambar;
      gambarReview.onload = e=>{
        if (e.target.width > e.target.height) {
        e.target.style.width = "auto";
      } else {
        e.target.style.height = "auto";
      }
      xGambar.value = this.value;
      if(daftaredit.classList.contains('edit')){
        resetGambar.style.display = 'inline-block';
      }
    }

};

const idFoto = document.getElementById('foto');
const fotoReview = document.getElementById('fotoReview');
const xFoto = document.getElementById('xFoto');

let dataFoto;
document.getElementById('pilihFoto').onclick = e=>{
  e.preventDefault();
  idFoto.click();
}

idFoto.onchange = async function(){
  if(!this.files[0] && xFoto.value){
    return;
  }
  dataFoto = await resizeIMG(this.files[0],document.getElementById('fotoX'));
  fotoReview.src = dataFoto;
      fotoReview.onload = e=>{
        if (e.target.height < e.target.width) {
        e.target.style.height = "100%";
        e.target.style.width = "auto";
      } else {
        e.target.style.width = "100%";
        e.target.style.height = "auto";
      }
      xFoto.value = this.value;
      if(daftaredit.classList.contains('edit')){
        resetFoto.style.display = 'inline-block';
      }
    }

};

function resizeIMG(file, review) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onloadend = () => {
      let res = fr.result;
      review.src = res;
      review.onload = (e) => {
        const canvas = document.createElement("canvas");
        const maxWidth = 500;
        const scaleSize = maxWidth / e.target.width;
        canvas.width = maxWidth;
        canvas.height = e.target.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);
        res = ctx.canvas.toDataURL(e.target, "image/jpeg");
        resolve(res);

      };
    };
  });
}

nowa.onkeyup = e=>{
  if(e.target.value[0] != '+' || e.target.value[1] != 6 || e.target.value[2] != 2){
    e.target.value = '+62';
  }
}

const waLogin = document.getElementById('walogin');

waLogin.onkeyup = e=>{
  if(e.target.value[0] != '+' || e.target.value[1] != 6 || e.target.value[2] != 2){
    e.target.value = '+62';
  }
}

const loginbtn = document.querySelector('.loginbtn');

const formLogin = document.forms["loginForm"];
formLogin.onsubmit = e=>{
  e.preventDefault();
  const a = waLogin.value.slice(1,waLogin.value.length).toString();

 let b;
  for(let i = 0;i < all.length;i++){
    if(all[i][1].toString().includes(a)){
      b = i;
      i = all.length-1;
    }
  }

 if(b == undefined){
   alertEror.innerHTML = `<strong class="text-center">Login gagal!</strong><br>Nomor ${waLogin.value} tidak terdaftar`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      return;
 }

loginbtn.classList.toggle('disabled');
loginbtn.innerHTML = `
Login <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
`;
topBarToggler.dataset.bsTarget = '';

 const obj = {
    SHEETID : sheetID,
    SHEETNAME : kecamatan,
    FN : 'LOGIN',
    data : [document.getElementById("pwlogin").value,all[b][2]]
 }
 
 fetch(urlDB,{method: "POST",body: JSON.stringify(obj)})
    .then((r) => r.text())
    .then((response) => {
      if (response == "Password Benar") {
        setCookie(b+'X',365);
        index = b;
        daftarprofil.textContent = 'Profil';
        loadEdit(b);
      }else if(response.includes('encrypted')){
        alertEror.innerHTML = `<strong class="text-center">Login Gagal!</strong><br>Kata sandi salah`;
        
      
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      
      loginbtn.classList.toggle('disabled');
loginbtn.textContent = 'Masuk'
    }else{
      alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    }
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
    })
    .catch(error =>{
      alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      loginbtn.classList.toggle('disabled');
loginbtn.textContent = 'Masuk';
topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
    });
}

const formDaftar = document.forms["daftar"];

formDaftar.onsubmit = function (e) {
  e.preventDefault();
  if(daftaredit.classList.contains('daftar')){
    daftar();
  }else if(daftaredit.classList.contains('edit')){
    edit(index);
  }
  
};

const idPW = document.getElementById('pw');
const idPW2 = document.getElementById('pw2');
const btnKirim = document.querySelector(".btn-kirim");
const kirim = document.getElementById("kirim");
const simpanOK = document.querySelector(".simpanOK");

function daftar(){
  if(idPW.value !== idPW2.value){
  alertEror.innerHTML = `<strong class="text-center">Konfirmasi kata sandi tidak sesuai!</strong><br>Silahkan coba lagi`;
      eror.click();
      return;
  }
  
  kembali.classList.toggle('scale0');
  topBarToggler.dataset.bsTarget = '';
  
  btnKirim.classList.toggle("d-none");
  kirim.classList.toggle("d-none");

  const noWA = nowa.value.slice(1,nowa.value.length);
  
  const gambar = {
    base64 : dataGambar.split("base64,")[1],
    namafile : noWA + 'a.jpg'
  };
  
  const foto = {
    base64 : dataFoto.split("base64,")[1],
    namafile : noWA + 'b.jpg'
  };

  let jenis = document.querySelector(".jenis div input:checked").value;
  if (jenis == 1) {
    jenis = "panggil";
  }

  if (document.querySelector("." + jenis).checked) {
    jenis = jenis + " 1";
  } else {
    jenis = jenis + " 0";
  }

  const obj = {
    SHEETID : sheetID,
    SHEETNAME : kecamatan,
    FN : 'CREATE',
    folderID : datax.folderID,
    images : [gambar,foto],
    data : [
      noWA,
      idPW.value,
      '','',
      judul.value,
      nama.value,
      jam.value,
      lokasi.value,
      jenis,
      deskrip.value,
      kunci.value
    ]
  };

  fetch(urlDB,{method: "POST",body: JSON.stringify(obj)})
    .then((r) => r.text())
    .then((response) => {
      kembali.classList.toggle('scale0');
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
      if (response == "New record created") {
        simpanOK.classList.toggle('a');
        history.back();

        btnKirim.classList.toggle("d-none");
  kirim.classList.toggle("d-none");
    if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
        afterDaftar(noWA);
        
      }else if(response == 'Nomor sudah ada'){
        alertEror.innerHTML = `<strong class="text-center">Nomor ${'+'+noWA}</strong><br>Sudah terdaftar!<br>Silahkan ganti nomor lain`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
      }else{
        alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
      }
    })
    .catch((error) => {
      kembali.classList.toggle('scale0');
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
      alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
    });
}

async function afterDaftar(noWA){
  try{
  all = await ambilData();
        for(let i = all.length-1;i >= 0;i--){
          if(all[i].indexOf(parseInt(noWA)) > -1){
            setCookie(i+'X',365);
            index = i;
            formjudul.textContent = 'Formulir Edit';
            daftarprofil.textContent = 'Profil';
            xGambar.value = all[i][3];
            xFoto.value = all[i][4];
            resetGambar.dataset.src = all[i][3];
            resetFoto.dataset.src = all[i][4];
            simpanOK.classList.toggle('a');
            editCentang.classList.toggle('a');
            iklan.classList.toggle('d-none');
            hasilcari.innerHTML = info;
        randomData();
  
  pwEdit();
            i = 0;
          }
        }
  }catch (err) {
      koneksi = false;
      simpanOK.classList.toggle('a');
      editCentang.classList.toggle('a');
      iklan.classList.toggle('d-none');
      hasilcari.innerHTML = info;
      searchBtn.classList.toggle("disabled");
      searchBtn.textContent = "Cari";
      return;
    }
}

let dangerOutlined;
let successOutlined;

function edit(i){
  const x = [];
  all[i].forEach((a,b)=>{
    if(b != 0 && b != 2 && b != 12){
      x.push(a);
    }
  });
  
  let jenis = document.querySelector(".jenis div input:checked").value;
  if (jenis == 1) {
    jenis = "panggil";
  }

  if (document.querySelector("." + jenis).checked) {
    jenis = jenis + " 1";
  } else {
    jenis = jenis + " 0";
  }
  
  if(dangerOutlined.value == '1' && x.join('') == nowa.value.slice(1,nowa.value.length)+
  xGambar.value+
  xFoto.value+
  judul.value+
  nama.value+
  jam.value+
  lokasi.value+
  jenis+
  deskrip.value+
  kunci.value){
    
    history.back();
  }else{
    if(successOutlined.value == '1' && idPW.value !== idPW2.value){
  alertEror.innerHTML = `<strong class="text-center">Konfirmasi kata sandi tidak sesuai!</strong><br>Silahkan coba lagi`;
      eror.click();
      return;
  }
  
  kembali.classList.toggle('scale0');
  topBarToggler.dataset.bsTarget = '';
  
  btnKirim.classList.toggle("d-none");
  kirim.classList.toggle("d-none");

  const noWA = nowa.value.slice(1,nowa.value.length);
  
  const obj = {
    SHEETID : sheetID,
    SHEETNAME : kecamatan,
    FN : 'UPDATE',
    INDEX : index,
    pwlama : document.getElementById('pwlama').value,
    data : [
      all[i][0],
      noWA,
      all[i][2],
      all[i][3],
      all[i][4],
      judul.value,
      nama.value,
      jam.value,
      lokasi.value,
      jenis,
      deskrip.value,
      kunci.value]
  };
  if(xGambar.value == all[i][3] && xFoto.value == all[i][4]){}else{
    let gambar;
    if(xGambar.value != all[i][3]){
      gambar = {
    base64 : dataGambar.split("base64,")[1],
    namafile : noWA + 'a.jpg'
  };
    }
  
  let foto;
  if(xFoto.value != all[i][4]){
  foto = {
    base64 : dataFoto.split("base64,")[1],
    namafile : noWA + 'b.jpg'
  };
  }
  obj.folderID = datax.folderID;
  obj.images = [gambar,foto];
  }
  
  if(successOutlined.value == '1'){
    obj.pwbaru = idPW.value;
  }
  
  
  
  fetch(urlDB,{method: "POST",body: JSON.stringify(obj)})
    .then((r) => r.text())
    .then((response) => {
      kembali.classList.toggle('scale0');
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
      if (response == "Record updated") {
        simpanOK.classList.toggle('a');
        history.back();
     
        if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
        afterEdit();
      }else if(response == 'Nomor sudah ada'){
        alertEror.innerHTML = `<strong class="text-center">Nomor ${'+'+noWA}</strong><br>Sudah terdaftar!<br>Silahkan ganti nomor lain`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
      
      }else if(response.includes('encrypted')){
        if(successOutlined.value == '1'){
          alertEror.innerHTML = `<strong class="text-center">Gagal mengganti kata sandi!</strong><br>Kata sandi lama tidak sesuai`;
        }else{
        
        alertEror.innerHTML = `<strong class="text-center">Gagal menyimpan!</strong><br>Kata sandi salah`;
        }
      
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }else{
        alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
      
      })
    .catch((error) => {
      kembali.classList.toggle('scale0');
      topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
      alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      btnKirim.classList.toggle("d-none");
      kirim.classList.toggle("d-none");
    });
    
    
  }
}

async function afterEdit(){
  try{
  all = await ambilData();
  editCentang.classList.toggle('a');
   simpanOK.classList.toggle('a');
   iklan.classList.toggle('d-none');
  hasilcari.innerHTML = info;
  randomData();
  }catch (err) {
      koneksi = false;
      editCentang.classList.toggle('a');
   simpanOK.classList.toggle('a');
   iklan.classList.toggle('d-none');
      hasilcari.innerHTML = info;
      searchBtn.classList.toggle("disabled");
      searchBtn.textContent = "Cari";
      return;
    }
}

function pwEdit(){
  document.getElementById('pwx').innerHTML =`Ubah kata sandi? <input type="radio" class="btn-check" name="options-outlined" id="success-outlined" autocomplete="off" value="" required>
<label class="btn btn-outline-success ubahYa" for="success-outlined">Ya</label>

<input type="radio" class="btn-check" name="options-outlined" id="danger-outlined" autocomplete="off" value="" required>
<label class="btn btn-outline-danger ubahNo" for="danger-outlined">Tidak</label>

  <div class="mt-3" id="pwView"></div>`;
  
  const pwView = document.getElementById('pwView');
  
  successOutlined = document.getElementById('success-outlined');
  dangerOutlined = document.getElementById('danger-outlined');
  
document.querySelector('.ubahNo').onclick = e=>{
  if(dangerOutlined.value == '1'){
    return;
  }
  successOutlined.value = '';
  dangerOutlined.value = '1';
  pwView.innerHTML = `<div class="mb-3">
                <label for="pwlama" class="form-label"
                  >Konfirmasi kata sandi :</label>
                <input
                  type="password"
                  class="form-control"
                  id="pwlama"
                  name="pwlama"
                  minLength="8"
                  maxlength="16"
                  placeholder="********"
                  required
                />
              </div>`;
}

document.querySelector('.ubahYa').onclick = e=>{
  if(successOutlined.value == '1'){
    
    return;
  }

  dangerOutlined.value = '';
  successOutlined.value = '1';
  pwView.innerHTML = `<div class="mb-3">
                <label for="pwlama" class="form-label"
                  >Konfirmasi kata sandi lama :</label>
                <input
                  type="password"
                  class="form-control"
                  id="pwlama"
                  name="pwlama"
                  minLength="8"
                  maxlength="16"
                  placeholder="********"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="pw" class="form-label"
                  >Buat kata sandi baru :</label>
                <input
                  type="password"
                  class="form-control"
                  id="pw"
                  name="pw"
                  minLength="8"
                  maxlength="16"
                  placeholder="********"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="pw2" class="form-label"
                  >Konfirmasi kata sandi :<br
                /></label>
                <input
                  type="password"
                  class="form-control"
                  id="pw2"
                  name="pw2"
                  minLength="8"
                  maxlength="16"
                  placeholder="********"
                  required
                />
              </div>`;
}
}

document.querySelector('.resetGambar').onclick = e=>{
  xGambar.value = e.target.dataset.src;
  gambarReview.src = '';
  gambarReview.src = e.target.dataset.src;
  idGambar.value = '';
  gambarReview.onload = x=>{
        if (x.target.width > x.target.height) {
        x.target.style.width = "auto";
      } else {
        x.target.style.height = "auto";
      }
      e.target.style.display = 'none';
    }
}

resetFoto.onclick = e=>{
  xFoto.value = e.target.dataset.src;
  fotoReview.src = '';
  fotoReview.src = e.target.dataset.src;
  idFoto.value = '';
      fotoReview.onload = x=>{
        if (x.target.height < x.target.width) {
        x.target.style.height = "100%";
        x.target.style.width = "auto";
      } else {
        x.target.style.width = "100%";
        x.target.style.height = "auto";
      }
      e.target.style.display = 'none';
    }
}

document.querySelector('.editbtn').onclick = e=>{
  daftaredit.classList.toggle('a');
  daftaredit.classList.toggle('edit');
  editCentang.classList.toggle('a');
  iklan.classList.toggle('d-none');
  window.history.pushState(0, null, "");
}


eror.onclick = (e) => {
  if (eror.classList.contains("x")) {
    eror.classList.remove("x");
  } else if (!eror.classList.contains("a")) {
    eror.classList.add("a");
    window.history.pushState(0, null, "");
  }
};

document.querySelector(".tutup-alert").onclick = (e) => {
  history.back();
};

document.querySelector('.centangbtn').onclick = e=>{
  centangPage.classList.toggle('a');
  editCentang.classList.toggle('a');
  iklan.classList.toggle('d-none');
  window.history.pushState(0, null, "");
}

const pilihHarga = document.getElementById('pilihHarga');
const nominal = document.getElementById('nominal');
const pilihTransfer = document.getElementById('pilihTransfer');
const profil = document.querySelector('.profil');

harga.onchange = e=>{
  
  if(e.target.value.split('/')[1] == 0){
    if(!infoHarga.classList.contains('text-muted')){
      infoHarga.classList.replace('text-success','text-muted');
    }
    infoHarga.textContent = '*Hemat Rp. 0 dari paket yang anda pilih';
    pilihHarga.value = e.target.value;
    nominal.textContent = 'Rp. '+e.target.value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if(pilihTransfer.value != '' && nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
      profil.scrollTo({top:centangPage.scrollHeight,behavior: "smooth"});
    }
  }else if(e.target.value.split('/')[1] > 0){
    if(!infoHarga.classList.contains('text-success')){
      infoHarga.classList.replace('text-muted','text-success');
    }
  
    const a = datax.harga[parseInt(e.target.value.split('/')[1])][2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    infoHarga.textContent = `*Hemat Rp. ${a} dari paket yang anda pilih`;
    pilihHarga.value = e.target.value; 
    nominal.textContent = 'Rp. '+e.target.value.split('/')[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if(pilihTransfer.value != '' && nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
      profil.scrollTo({top:centangPage.scrollHeight,behavior: "smooth"});
    }
  }else{
    infoHarga.textContent = '';
    pilihHarga.value = '';
    if(!nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
    }
  }
}

const tujuanTransfer = document.getElementById('tujuanTransfer');

transferKe.onchange = e=>{
  if(e.target.value != ''){
    const a = e.target.value.split('/');
    pilihTransfer.value = a[0];
    tujuanTransfer.textContent = a[0];
    document.getElementById('nomorTujuan').textContent = datax.transfer[parseInt(a[1])][1];
    document.getElementById('namaTujuan').textContent = datax.transfer[parseInt(a[1])][2];
    if(pilihHarga.value != '' && nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
      
      profil.scrollTo({top:centangPage.scrollHeight,behavior: "smooth"});
      
    }
  }else{
    pilihTransfer.value = '';
    if(!nextAktivasi.classList.contains('d-none')){
      nextAktivasi.classList.toggle('d-none');
    }
  }
}

const ss = document.getElementById('ss');
let dataSS;
document.getElementById('pilihSS').onclick = e=>{
  e.preventDefault();
  ss.click();
}

ss.onchange = async function(){
  if(!this.files[0] && document.getElementById('xSS').value){
    return;
  }
  
  dataSS = await resizeIMG(this.files[0],document.getElementById('ssX'));
  ssReview.src = dataSS;
      ssReview.onload = e=>{
        if (e.target.width - e.target.height > e.target.width) {
        e.target.style.height = "auto";
        e.target.style.width = "95%";
      } else {
        e.target.style.width = "auto";
        e.target.style.height = "100%";
      }
      document.getElementById('xSS').value = this.value;
    
    }

};

const aktivasibtn = document.querySelector('.aktivasibtn');
const formAktivasi = document.forms["aktivasi"];
const aktivasiproses = document.querySelector('.aktivasiproses');

formAktivasi.onsubmit = e=>{
  e.preventDefault();
  
  aktivasibtn.classList.toggle('d-none');
  aktivasiproses.classList.toggle('d-none');
  centangBack.classList.toggle('scale0');
  topBarToggler.dataset.bsTarget = '';
  
  const h = parseInt(harga.value.split('/')[0]);
  let jmlHari = 30;
  
  if(h > datax.harga[0][0]){
  jmlHari = (h/datax.harga[0][0]+h/datax.harga[1][0])*30;
  }
  
  let offDay;
  if(statusCentang.classList.contains('alert-success')){
    const tglX = all[index][12].split('#');
    offDay = new Date(new Date(tglX[2],parseInt(tglX[1])-1,tglX[0]).setDate(new Date().getDate()+jmlHari));
  }else{
  
  offDay = new Date(new Date().setDate(new Date().getDate()+jmlHari));
  }
  offDay = offDay.getDate()+'#'+(offDay.getMonth()+1)+'#'+offDay.getFullYear();
  
  const obj ={
    SHEETID : sheetID,
    SHEETNAME : 'Centang',
    FN : 'LAPOR',
    folderID : datax.folderID,
    images : [{
    base64 : dataSS.split("base64,")[1],
    namafile : all[index][1] + '.jpg'
  }],
    data : [kecamatan,index,all[index][0],tujuanTransfer.textContent+'/'+h,offDay]
  };
  
  fetch(urlDB, { method: "POST", body: JSON.stringify(obj) })
    .then((r) => r.text())
    .then((response) => {
      centangBack.classList.toggle('scale0');
  topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
  aktivasibtn.classList.toggle('d-none');
  aktivasiproses.classList.toggle('d-none');
      if(response == 'lapor ok'){
        setCookie(index+'X'+offDay,365);
      
    divAktivasi.classList.toggle('a');
    callAdmin.classList.toggle('a');
    if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }else{
        alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      }
    })
    .catch(err=>{
      centangBack.classList.toggle('scale0');
  topBarToggler.dataset.bsTarget = '#navbarNavAltMarkup';
  aktivasibtn.classList.toggle('d-none');
  aktivasiproses.classList.toggle('d-none');
      
      alertEror.innerHTML = `<strong class="text-center">Terjadi error!</strong><br>Silahkan coba lagi<br>Semoga berhasil`;
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
    });
}

const instalbtn = document.getElementById("instalbtn");

let timeinstal = undefined;

window.onload = () => {
  const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
      
      try {
        const registration = await navigator.serviceWorker.register("sw.js?x="+new Date().getTime());
        if (registration.active) {
          if (instalbtn.classList.contains('a') || instalbtn.classList.contains('b') || instalbtn.classList.contains("disabled")) {
            timeinstal = setTimeout(() => {
              instalbtn.classList.remove("disabled");
              if(!instalbtn.classList.contains("btn-success")){
              instalbtn.classList.replace("btn-primary","btn-success");
              }
              instalbtn.classList.add("a");
              instalbtn.textContent = 'Buka Aplikasi';
              if (
                window.orientation > 1 &&
                !navigator.userAgent.includes("Chrome")
              ) {
                alertEror.textContent =
                  "Disarankan menggunakan Google Chrome untuk dapat menginstal aplikasi!";
                eror.click();
                if ("vibrate" in navigator) {
                  navigator.vibrate(200);
                }
              }
              
            }, 15000);
          }
          mulai();
          
        } else {
          registerServiceWorker();
        }
      } catch (error) {
        mulai();
      }
    } else {
      mulai();
    }
  };

  registerServiceWorker();
};

const instal = document.querySelector(".instal");
const collapseOne = document.getElementById("flush-collapseOne");
const accordionbtn = document.querySelector(".accordion-button");
const utama = document.querySelector(".utama");

function mulai() {
  document.querySelector("body > .loader").style.display = "none";
  if (
    window.matchMedia("(display-mode: standalone)").matches != true &&
    "getInstalledRelatedApps" in navigator
  ) {
    instal.classList.remove("a");
 
    navigator.getInstalledRelatedApps().then((e) => {
      if (e[0].platform == "webapp") {
        clearTimeout(timeinstal);
  timeinstal = undefined;
        instalbtn.classList.remove("disabled");
        if(!instalbtn.classList.contains("btn-success")){
        instalbtn.classList.replace("btn-primary", "btn-success");
        }
        if(!instalbtn.classList.contains('b')){
      instalbtn.classList.toggle('b');
    }
        instalbtn.textContent = "Buka Aplikasi";
      }
    });

    setTimeout(() => {
      if (
        !collapseOne.classList.contains("show")
      ) {
        accordionbtn.click();
      }
    }, 2300);
  } else {
    if ("getInstalledRelatedApps" in navigator) {
      utama.classList.remove("a");
      searchBtn.click();
      if (history.length > 1) {
        history.back();
      }
    }else if(document.cookie){
      instalbtn.classList.add("a");
      instalbtn.click();
    }else{
        setCookie(-1,365);

      instal.classList.remove("a");
      alertEror.textContent =
        "Disarankan menggunakan Google Chrome untuk dapat menginstal aplikasi!";
      eror.click();
      if ("vibrate" in navigator) {
        navigator.vibrate(200);
      }
      instalbtn.classList.replace("btn-primary", "btn-success");
      instalbtn.classList.add("a");
      instalbtn.textContent = "Buka Aplikasi";
      instalbtn.classList.remove("disabled");
      setTimeout(() => {
        if (
          !collapseOne.classList.contains("show")
        ) {
          accordionbtn.click();
        }
      }, 2300);
    }
  }
}

window.addEventListener("beforeinstallprompt", function (e) {
  clearTimeout(timeinstal);
  timeinstal = undefined;
  instalbtn.classList.remove("disabled");
  if (instalbtn.classList.contains("btn-success")) {
    instalbtn.classList.replace("btn-success", "btn-primary");
  }
  instalbtn.textContent = "Instal Sekarang";
 
  navigator.getInstalledRelatedApps().then((x) => {
    if (x[0].platform == "webapp") {
      if(!instalbtn.classList.contains('b')){
      instalbtn.classList.toggle('b');
    }
      instalbtn.textContent = "Buka Aplikasi";
    }
  });
  
  if(instalbtn.classList.contains('a')){
      instalbtn.classList.toggle('a');
    }

  instalbtn.onclick = function () {
    if (instalbtn.classList.contains('a') || instalbtn.classList.contains('b') || instalbtn.classList.contains("disabled")) {
      return;
    }

    instalbtn.classList.toggle("disabled");
    instalbtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;

    e.prompt();
  };
});

function installed() {
  setTimeout(() => {
    if (
      !collapseOne.classList.contains("show")
    ) {
      accordionbtn.click();
    }
  }, 2300);

  timeinstal = setTimeout(() => {
    instalbtn.classList.replace("btn-primary", "btn-success");
    instalbtn.classList.toggle("disabled");
    instalbtn.classList.add("a");
    instalbtn.textContent = "Buka Aplikasi";
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }, 30000);

  let a = setInterval((_) => {
    navigator.getInstalledRelatedApps().then((e) => {
      if (e[0].platform == "webapp") {
        b();
      }
    });
  }, 300);

  function b() {
    clearTimeout(a);
    a=undefined;
    clearTimeout(timeinstal);
    timeinstal=undefined;
    instalbtn.classList.remove("disabled");
    instalbtn.classList.replace("btn-primary", "btn-success");
    if(instalbtn.classList.contains('a')){
      instalbtn.classList.toggle('a');
    }
    if(!instalbtn.classList.contains('b')){
      instalbtn.classList.toggle('b');
    }
    instalbtn.textContent = "Buka Aplikasi";
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }
}

window.addEventListener("appinstalled", (e) => {
  if (window.orientation < 1) {
    instalbtn.innerHTML = `Menginstal <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
    if (!instalbtn.classList.contains("disabled")) {
      instalbtn.classList.add("disabled");
    }
    installed();
  } else {
    instalbtn.classList.add("a");
    instalbtn.textContent = "Buka Aplikasi";
    instalbtn.click();
  }
});

const splashbtn = document.getElementById("splashbtn");

instalbtn.addEventListener("click", (e) => {
  if (instalbtn.classList.contains("a")) {
    instalbtn.classList.remove("a");
    searchBtn.click();
    splashbtn.click();
    instal.classList.add("a");
    setTimeout(() => {
      utama.classList.remove("a");
      setTimeout(() => {
        splashbtn.click();
      }, 2000);
    }, 1000);
  } else if (instalbtn.classList.contains("b")) {
    window.open(".");
  }
});
