using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using NUnit.Framework;

namespace ReactDataGridTests
{
    [TestFixture]
    public class OuterEvent: Base
    {
        [Test]
        public void Click_On_Goto2NdPage()
        {
            GoTo2NdPageButton.Click();

            TestPageNumber(2);
        }
    }
}
