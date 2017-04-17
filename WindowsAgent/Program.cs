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
                                        Microsoft.Win32.RegistryKey key = Microsoft.Win32.RegistryKey.OpenBaseKey(Microsoft.Win32.RegistryHive.LocalMachine, Microsoft.Win32.RegistryView.Registry64);
                                        key.CreateSubKey("Software\\AgentMonitoring");
                                        key = key.OpenSubKey("Software\\AgentMonitoring", true);
                                        key.SetValue("IPListener", args[1], Microsoft.Win32.RegistryValueKind.String);
                                        key.Close();
                                        break;
                                    }
                                case "-uninstall":
                                    {
                                        ManagedInstallerClass.InstallHelper(new string[] { "/u", Assembly.GetExecutingAssembly().Location });
                                        Microsoft.Win32.RegistryKey key = Microsoft.Win32.RegistryKey.OpenBaseKey(Microsoft.Win32.RegistryHive.LocalMachine, Microsoft.Win32.RegistryView.Registry64);
                                        key.DeleteSubKey("Software\\AgentMonitoring");
                                        key.DeleteValue("IPListener");
                                        key.Close();
                                        break;
                                    }
                                default: break;
                            }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message.ToString());
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
