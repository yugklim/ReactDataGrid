using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Support.Extensions;

namespace ReactDataGridTests
{
    public class Base
    {
        protected string StartUrl { get; set; }

        protected string DriverPath { get; set; }

        public TimeSpan Timeout { get; set; }

        protected IWebDriver Driver { get; set; }

        protected IWebElement PageFirstElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<<\"]')[0]");
            }
        }


        protected IWebElement PageDownElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\"<\"]')[0]");
            }
        }

        protected IWebElement PageUpElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\">\"]')[0]");
            }
        }

        protected IWebElement PageLastElement
        {
            get
            {
                return Driver.ExecuteJavaScript<IWebElement>("return $(':button[value=\">>\"]')[0]");
            }
        }

        [SetUp]
        public void Init()
        {
            StartUrl = @"http://localhost:22404/ReactDataGridTest";
            DriverPath = @"D:\Selenium_Chrome";
            Timeout = new TimeSpan(0, 0, 10);
            Driver = new ChromeDriver(DriverPath);
        }

        [TearDown]
        public void Close()
        {
            Driver.Close();
            Driver.Dispose();
        }

        protected void GoToStartUrl()
        {
            Driver.Navigate().GoToUrl(StartUrl);
        }
    }
}
