
var datas = [
    {
      "low":0,
      "top":10,
      "range": "0-10",
      "description": "Very Bad",
      "comments": "Your IT infrastructure is in critical condition. Major issues are present that could severely impact your business operations. Without immediate intervention, your system is vulnerable to failures, breaches, and inefficiencies.",
      "recommendations": [
        "Immediate Action Required: Engage an MSP urgently to assess and overhaul your entire IT environment.",
        "Security and Stability: Begin with strengthening basic security protocols and ensuring network reliability.",
        "Backup and Recovery Plan: Establish automated backup solutions and a disaster recovery plan.",
        "Ongoing Support Needed: Continuous monitoring and assistance are crucial to avoid further deterioration and ensure long-term business continuity."
      ]
    },
    {
      "low":10,
      "top":20,
      "range": "10-20",
      "description": "Bad",
      "comments": "Your IT system has multiple weak points, making it difficult to maintain stability and security. Your current setup puts your business at risk for potential downtime and cyber threats.",
      "recommendations": [
        "Urgent Support Needed: Partner with an MSP to address critical gaps in your infrastructure, especially in cybersecurity and network performance.",
        "Security Reinforcement: Implement stronger defenses such as multi-factor authentication and encryption.",
        "Proactive Monitoring: Set up monitoring tools to identify and resolve issues before they cause serious disruptions.",
        "Ongoing Assistance Required: Regular IT reviews and professional support are needed to bring your system up to standard and ensure smooth operations."
      ]
    },
    {
      "low":20,
      "top":30,
      "range": "20-30",
      "description": "Needs Important Improvements",
      "comments": "Your IT infrastructure is operational but contains significant inefficiencies and vulnerabilities. While it may handle day-to-day operations, critical improvements are required to ensure long-term growth and stability.",
      "recommendations": [
        "Strategic IT Partnership: Collaborate with an MSP to create a clear roadmap for resolving current issues and implementing future improvements.",
        "Security Upgrades: Address security vulnerabilities through comprehensive audits and improved defense mechanisms.",
        "Efficiency Boost: Upgrade aging systems and introduce more efficient processes like automation and cloud services.",
        "Long-Term Assistance: Ongoing IT support is essential to avoid potential setbacks and stay on track with industry standards."
      ]
    },
    {
      "low":30,
      "top":40,
      "range": "30-40",
      "description": "Average but You Definitely Need to Improve",
      "comments": "Your IT systems are functional but not optimized. You're experiencing gaps in efficiency and security that could hinder growth if not addressed. While you're maintaining operations, there's significant room for improvement.",
      "recommendations": [
        "Proactive IT Assistance: Partner with an MSP to fine-tune your systems, focusing on efficiency, scalability, and advanced security protocols.",
        "Security Enhancements: Implement advanced measures such as intrusion detection systems and data encryption.",
        "Performance Tuning: Focus on improving network speed and server reliability to optimize daily operations.",
        "Continuous Improvement: IT is an evolving field; regular MSP support is vital to keep up with the latest technologies and avoid falling behind."
      ]
    },
    {
      "low":40,
      "top":50,
      "range": "40-50",
      "description": "Below Average but Functional",
      "comments": "Your IT environment is stable but far from reaching its full potential. Though there are no immediate critical issues, your infrastructure is not agile or secure enough to support future growth or protect against emerging threats.",
      "recommendations": [
        "Strategic Optimization: Work with an MSP to optimize security, network infrastructure, and operational efficiency.",
        "Security Focus: Strengthen cybersecurity by adopting advanced threat detection systems and regular security audits.",
        "Scalability: Prepare your systems for future growth by evaluating cloud solutions and infrastructure upgrades.",
        "MSP Support Required: Regular IT assessments and improvements through professional support will ensure that your system evolves in line with business needs."
      ]
    },
    {
      "low":50,
      "top":60,
      "range": "50-60",
      "description": "Good but Needs Regular Attention",
      "comments": "Your IT systems are generally well-maintained but not without vulnerabilities. While they may be meeting current business needs, there's a risk of falling behind if you don’t continue to improve security, efficiency, and scalability.",
      "recommendations": [
        "Continuous IT Partnership: Work closely with an MSP to refine your infrastructure and keep up with technological advancements.",
        "Advanced Security Measures: Strengthen your security framework with real-time analytics and AI-driven threat detection.",
        "Future-Proofing: Begin planning for future business needs by upgrading systems for scalability and cloud readiness.",
        "Ongoing Maintenance Needed: Regular maintenance and audits by an MSP will be key to sustaining performance and security in the long term."
      ]
    },
    {
      "low":60,
      "top":80,
      "range": "60-80",
      "description": "Strong but Not Leading",
      "comments": "Your IT setup is solid, but there are still areas that need attention to stay competitive in a fast-evolving industry. While you're ahead of many, stagnation can lead to vulnerabilities and inefficiencies that others could exploit.",
      "recommendations": [
        "Stay Proactive: Partner with an MSP to regularly assess your infrastructure, ensuring it remains secure, scalable, and efficient.",
        "Security Innovations: Implement the latest security technologies, such as machine learning-based threat detection, to stay ahead of potential threats.",
        "Scalable Solutions: Focus on scalable IT solutions that will support long-term growth without excessive cost.",
        "Don’t Become Complacent: Continuous improvement and support are necessary to stay competitive and avoid falling behind your industry peers."
      ]
    },
    {
      "low":80,
      "top":100,
      "range": "80-100",
      "description": "Excellent but Not Market Leader",
      "comments": "Your IT infrastructure is robust and well-optimized, but there is always room for improvement. Remaining at this level requires constant innovation and vigilant maintenance. Without continuous effort, even the best systems can become outdated quickly in today’s fast-paced environment.",
      "recommendations": [
        "Cutting-Edge Technologies: Work with an MSP to explore emerging technologies like AI, machine learning, and blockchain to maintain an edge over competitors.",
        "Cybersecurity Vigilance: Even with strong defenses in place, new threats arise daily. Stay proactive by implementing real-time monitoring and adaptive threat management systems.",
        "Optimize for Efficiency: Evaluate current IT processes to identify areas for automation or cost savings.",
        "Future Collaboration: Maintaining this level of IT excellence requires ongoing partnership with an MSP to ensure your systems remain future-proof and industry-leading."
      ]
    }
  ];

function displayComment(score){
    for(let i = 0; i < 8; i++){
        if(datas[i]["low"] < score && score <= datas[i]["top"]){
            finalResult.push(datas[i]["description"])
            finalResult.push(datas[i]["comments"])
            finalResult.push(datas[i]["recommendations"][0])
            finalResult.push(datas[i]["recommendations"][1])
            finalResult.push(datas[i]["recommendations"][2])
            finalResult.push(datas[i]["recommendations"][3])

            document.getElementById("description").innerText = datas[i]["description"];
            document.getElementById("comments").innerText = datas[i]["comments"];
            document.getElementById("rec1").innerText = datas[i]["recommendations"][0];
            document.getElementById("rec2").innerText = datas[i]["recommendations"][1];
            document.getElementById("rec3").innerText = datas[i]["recommendations"][2];
            document.getElementById("rec4").innerText = datas[i]["recommendations"][3];

        }
    }
  }