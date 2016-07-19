using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.Extensions;
using OpenQA.Selenium.Support.UI;

namespace ReactDataGridTests
{
    [TestFixture]
    public class MultiSelect: Base
    {
        [Test]
        public void Does_Multiselect_Work()
        {
            Driver.ExecuteJavaScript("rdcTesting.multiselect()");
            bool isNthRowSelected = IsNthRowSelected(99);
            Assert.IsTrue(isNthRowSelected);
        }
    } 
}
