import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Observable } from 'rxjs/Observable';
import { ChatPage } from '../chat/chat';


@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html'
})
export class BluetoothPage {

  private device;
  private devices: Array<any>;
  private connect: Observable<any>;

  constructor(public navCtrl: NavController,
              public bluetoothSerial: BluetoothSerial) {
    this.devices = new Array();
  }

  buscarDispositivos() {
    this.devices.splice(0, this.devices.length);
    this.bluetoothSerial.setDeviceDiscoveredListener().subscribe(device => {
      console.log(JSON.stringify(device));
      this.adicionarList(device);
    });
    this.bluetoothSerial.isEnabled().then(() => {
      return this.listarDevices();
    }, 
    () => {
      return this.bluetoothSerial.enable().then(() => {
        return this.listarDevices();
      });
    });
  }

  adicionarList(device) {
    if (device) {    
      let found = this.devices.findIndex((value, index, array) => {              
        return (device.address === value.address);          
      });
      if (found === -1) {          
        return this.devices.push(device);
      }
    }
  }

  listarDevices() {
    this.bluetoothSerial.discoverUnpaired();
    return this.bluetoothSerial.list().then(devices => {
      return Array(devices).forEach(device => {
        return this.adicionarList(device[0]);
      });    
    });
  }  

  iniciar() {        
    this.bluetoothSerial.connect(this.device.address).subscribe(success => {
      this.bluetoothSerial.isConnected().then(() => {        
        this.navCtrl.push(ChatPage, this.device);
      });            
    });       
  }

  acessar() {
    this.bluetoothSerial.isConnected().then(() => {
      this.navCtrl.push(ChatPage, this.device);
    },
    () => {
      this.navCtrl.push(ChatPage, this.device);
    });
  }
}
