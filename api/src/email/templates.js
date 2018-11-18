export const updatedRealityEmail = ({
  nodeId,
  title,
  description,
  guideEmail,
  realizerEmail,
}) => `<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<table style="width:100%" border="0" cellpadding="0" cellspacing="0" table-responsive>
  <tbody>
    <tr>
      <td
        style="background-color: #00cf19; height:222px;text-align:center;color:white;font-size: 30px;font-weight: bold;"
      >
        New email from Realities
      </td>
    </tr>
    <tr>
      <td style="height:50px;"></td>
    </tr>
    <tr>
      <td style="color: #843cfd; text-align:center;font-size:23px;">
        Updated reality
      </td>
    </tr>
    <tr>
      <td style="height:20px;"></td>
    </tr>
    <tr style="font-size: 16px;">
      <td style="text-align:center;">
        <b>Title:</b> ${title}<br />
        <b>Description:</b> ${description}<br />
        <b>Realizer:</b> ${realizerEmail}<br />
        <b>Guide:</b> ${guideEmail}
      </td>
    </tr>
    <tr>
      <td style="height:50px;text-align:center;"></td>
    </tr>
    <tr>
      <td style="text-align:center; font-size: 16px;">Link: http://localhost:3000/${nodeId}</td>
    </tr>
  </tbody>
</table>
</body>
</html>`;

export const another = 'hello';
