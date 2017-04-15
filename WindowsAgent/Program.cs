using System;
using System.Collections;
using System.Configuration.Install;
using System.IO;
using System.Linq;
using System.Reflection;
using System.ServiceProcess;
using System.Text;

namespace WindowsAgent
{
    static class Program
    {
        /// <summary>
        /// Главная точка входа для приложения.
        /// </summary>
        [STAThread]
        static void Main(string[] args = null)
        {
            ServiceBase[] ServicesToRun;
            /// <summary>
            /// Проверка на входные параметры, для инсталяции или деинсталяции
            /// </summary>
            /// 
            if (args.Length != 0)
            {
                if (System.Environment.UserInteractive)
                {
                    try
                    {
                        if (args.Length > 0)
                            switch (args[0])
                            {
                                case "-install":
                                    {
                                        ManagedInstallerClass.InstallHelper(new string[] { Assembly.GetExecutingAssembly().Location });
                                        Microsoft.Win32.RegistryKey key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey("Software", true);
                                        key.CreateSubKey("AgentMonitoring");
                                        key = key.OpenSubKey("AgentMonitoring", true);
                                        key.SetValue("IPListener", args[1]);
                                        Console.WriteLine(string.Format("Установка, мой IP {0}", args[1]));
                                        break;
                                    }
                                case "-uninstall":
                                    {
                                        ManagedInstallerClass.InstallHelper(new string[] { "/u", Assembly.GetExecutingAssembly().Location });
                                        break;
                                    }
                                default: break;
                            }
                    }
                    catch (Exception ex)
                    {

                    }
                }
            }
            else
            {
                ServicesToRun = new ServiceBase[] { new WAgent() };
                ServiceBase.Run(ServicesToRun);
            }
        }
    }
}
