﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Sockets;
using System.Net.NetworkInformation;

namespace WindowsAgent
{
    public partial class WAgent : ServiceBase
    {
        private Socket handler;
        public WAgent()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            //Слушаем порт в отдельным таском
            Task TwatcherInsert = Task.Factory.StartNew(() =>
            {
                ListenPorts();
            });
        }
        /// <summary>
        /// 
        /// </summary>
        protected override void OnStop()
        {
            handler.Shutdown(SocketShutdown.Both);
            handler.Close();
        }

        private void ListenPorts()
        {

            IPHostEntry ipHost = Dns.GetHostEntry("192.168.1.5");
            var myIP = ipHost.AddressList.Where(x => x.AddressFamily == AddressFamily.InterNetwork && x.ToString() == "192.168.1.5").ToList().First();
            IPEndPoint ipEndPoint = new IPEndPoint(myIP, 11000);
            Socket sListener = new Socket(myIP.AddressFamily, SocketType.Stream, ProtocolType.Tcp);
            // Назначаем сокет локальной конечной точке и слушаем входящие сокеты
            try
            {
                sListener.Bind(ipEndPoint);
                sListener.Listen(10);

                // Начинаем слушать соединения
                while (true)
                {
                    // Программа приостанавливается, ожидая входящее соединение
                    handler = sListener.Accept();
                    string data = null;
                    //Дождались запроса от сервера
                    //Считываем запрос
                    byte[] bytes = new byte[1024];
                    int bytesRec = handler.Receive(bytes);
                    data += Encoding.UTF8.GetString(bytes, 0, bytesRec);
                    //Инициализируем класса для мониторинга
                    MonitoringInfo MI = new MonitoringInfo(data);
                    //Получаем параметры мониторинга
                    MI.GetMonitoringParams();
                    //Переводим их в JSON формат
                    string reply = MI.ToJSON();
                    //Отправляем
                    byte[] msg = Encoding.UTF8.GetBytes(reply);
                    handler.Send(msg);
                }
            }
            catch (Exception ex)
            {

            }
        }
    }
}
