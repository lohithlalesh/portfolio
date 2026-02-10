<script>
const funnelData = {
  awareness: {
    title: "Awareness",
    tools: "Meta Ads, Taboola, Canva",
    channel: "Paid",
    kpis: "Reach, CPM, CTR"
  },
  consideration: {
    title: "Consideration",
    tools: "GA4, Semrush, Landing Pages",
    channel: "Paid + Organic",
    kpis: "Engagement, Time on Site"
  },
  conversion: {
    title: "Conversion",
    tools: "Meta Ads, HubSpot, Brevo",
    channel: "Paid + CRM",
    kpis: "CPA, CVR, ROAS"
  },
  retention: {
    title: "Retention",
    tools: "Brevo, Mailchimp, GA4",
    channel: "CRM",
    kpis: "LTV, Repeat Rate"
  }
};

const stages = document.querySelectorAll(".funnel-stage");

stages.forEach(stage => {
  stage.addEventListener("click", () => {
    stages.forEach(s => s.classList.remove("active"));
    stage.classList.add("active");

    const key = stage.dataset.stage;
    const data = funnelData[key];

    document.getElementById("stage-heading").textContent = data.title;
    document.getElementById("stage-tools").innerHTML = `<strong>Tools:</strong> ${data.tools}`;
    document.getElementById("stage-channel").innerHTML = `<strong>Channel:</strong> ${data.channel}`;
    document.getElementById("stage-kpis").innerHTML = `<strong>KPIs:</strong> ${data.kpis}`;
  });
});
</script>
