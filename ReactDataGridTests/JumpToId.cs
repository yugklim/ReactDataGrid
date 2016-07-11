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
    public class JumpToId: Base
    {
        [Test]
        public void Does_Jump_ToId_Work()
        {
            int jumpToId = 33;
            Driver.ExecuteJavaScript(string.Format("rdcTesting.renderJumpToId({0})", jumpToId));
            new WebDriverWait(Driver, Timeout).Until(ExpectedConditions.ElementExists(By.Id(jumpToId.ToString())));
            IsNthRowSelected(jumpToId);
        }
    }
}
